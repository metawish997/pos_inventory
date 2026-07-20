const mongoose = require('mongoose');
const PurchaseReturn = require('../models/PurchaseReturn');
const Purchase = require('../models/Purchase');
const { applyMovement } = require('../services/stockService');

const purchaseReturnController = {
    getAll: async (req, res) => {
        try {
            const { search, vendor } = req.query;
            const filter = {};
            if (vendor) filter.vendor = vendor;
            if (search) {
                filter.$or = [
                    { returnNumber: { $regex: search, $options: 'i' } },
                    { notes: { $regex: search, $options: 'i' } }
                ];
            }
            const returns = await PurchaseReturn.find(filter)
                .populate('vendor', 'vendorName vendorCode')
                .populate('purchase', 'purchaseNumber')
                .populate('warehouse', 'name')
                .sort({ createdAt: -1 });
            res.status(200).json(returns);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const ret = await PurchaseReturn.findById(req.params.id)
                .populate('vendor')
                .populate('purchase')
                .populate('warehouse')
                .populate('items.product', 'name sku')
                .populate('items.variant');
            if (!ret) return res.status(404).json({ error: 'Purchase return not found' });
            res.status(200).json(ret);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { purchase: purchaseId, items } = req.body;
            const purchase = await Purchase.findById(purchaseId).session(session);
            if (!purchase) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: 'Purchase not found' });
            }

            // Validate return quantities against purchased quantities
            for (const rItem of items) {
                const pItem = purchase.items.find(
                    (pi) => pi.product.toString() === rItem.product &&
                        ((pi.variant && rItem.variant && pi.variant.toString() === rItem.variant) ||
                            (!pi.variant && !rItem.variant))
                );
                if (!pItem) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ error: 'Returned item is not part of this purchase.' });
                }
                if (Number(rItem.returnQty) > Number(pItem.quantity)) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ error: `Return quantity exceeds purchased quantity for an item.` });
                }
            }

            // Compute return amount per item (proportional to purchase price)
            let totalReturnAmount = 0;
            const returnItems = items.map((rItem) => {
                const pItem = purchase.items.find(
                    (pi) => pi.product.toString() === rItem.product &&
                        ((pi.variant && rItem.variant && pi.variant.toString() === rItem.variant) ||
                            (!pi.variant && !rItem.variant))
                );
                const unitTotal = pItem.total / (Number(pItem.quantity) || 1);
                const returnAmount = Number((unitTotal * Number(rItem.returnQty)).toFixed(2));
                totalReturnAmount += returnAmount;
                return {
                    product: rItem.product,
                    variant: rItem.variant || null,
                    sku: pItem.sku,
                    returnQty: Number(rItem.returnQty),
                    reason: rItem.reason || '',
                    returnAmount
                };
            });

            const purchaseReturn = new PurchaseReturn({
                ...req.body,
                items: returnItems,
                totalReturnAmount: Number(totalReturnAmount.toFixed(2))
            });
            await purchaseReturn.save({ session });

            // Reduce stock via outward movement
            for (const rItem of returnItems) {
                await applyMovement({
                    type: 'Return',
                    warehouse: purchaseReturn.warehouse,
                    product: rItem.product,
                    variant: rItem.variant || null,
                    quantity: -rItem.returnQty,
                    reference: purchaseReturn.returnNumber,
                    referenceId: purchaseReturn._id,
                    reason: rItem.reason || 'Purchase return'
                }, session);
            }

            await session.commitTransaction();
            session.endSession();
            res.status(201).json(purchaseReturn);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            if (error.code === 11000) {
                return res.status(400).json({ error: 'Duplicate return number.' });
            }
            res.status(400).json({ error: error.message });
        }
    },

    remove: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const ret = await PurchaseReturn.findById(req.params.id).session(session);
            if (!ret) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: 'Purchase return not found' });
            }
            // Restore stock (reverse the outward movement)
            for (const rItem of ret.items) {
                await applyMovement({
                    type: 'Return',
                    warehouse: ret.warehouse,
                    product: rItem.product,
                    variant: rItem.variant || null,
                    quantity: rItem.returnQty,
                    reference: ret.returnNumber,
                    referenceId: ret._id,
                    reason: 'Return deleted - stock restored'
                }, session);
            }
            await PurchaseReturn.findByIdAndDelete(req.params.id).session(session);
            await session.commitTransaction();
            session.endSession();
            res.status(200).json({ message: 'Purchase return deleted successfully' });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = purchaseReturnController;
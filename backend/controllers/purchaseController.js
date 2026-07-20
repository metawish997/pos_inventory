const mongoose = require('mongoose');
const Purchase = require('../models/Purchase');
const Vendor = require('../models/Vendor');
const ProductItem = require('../models/ProductItem');
const { computeItemPricing, computePurchaseTotals } = require('../services/purchaseService');
const { applyMovement } = require('../services/stockService');
const { createProductTransaction } = require('../services/productService');

// Statuses that represent inward stock
const INWARD_STATUSES = ['Received', 'Completed', 'Approved'];

const purchaseController = {
    // LIST with optional filters
    getAll: async (req, res) => {
        try {
            const { search, status, vendor, warehouse } = req.query;
            const filter = {};
            if (status) filter.status = status;
            if (vendor) filter.vendor = vendor;
            if (warehouse) filter.warehouse = warehouse;
            if (search) {
                filter.$or = [
                    { purchaseNumber: { $regex: search, $options: 'i' } },
                    { invoiceNumber: { $regex: search, $options: 'i' } },
                    { referenceNumber: { $regex: search, $options: 'i' } }
                ];
            }
            const purchases = await Purchase.find(filter)
                .populate('vendor', 'vendorName vendorCode companyName')
                .populate('warehouse', 'name')
                .sort({ createdAt: -1 });
            res.status(200).json(purchases);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const purchase = await Purchase.findById(req.params.id)
                .populate('vendor')
                .populate('warehouse')
                .populate('items.product', 'name sku images')
                .populate('items.variant')
                .populate('items.tax');
            if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
            res.status(200).json(purchase);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // CREATE (Draft by default, or provided status)
    create: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const body = { ...req.body };
            if (req.user) body.createdBy = req.user._id;

            // Create any inline unsaved products before instantiating Purchase
            // to avoid Mongoose ObjectId cast errors on temp IDs.
            const createdProductsMap = {};
            if (body.items && Array.isArray(body.items)) {
                for (let i = 0; i < body.items.length; i++) {
                    const item = body.items[i];
                    if (item.newProductPayload) {
                        const tempProductId = item.product;
                        if (!createdProductsMap[tempProductId]) {
                            const { product, createdItems } = await createProductTransaction(item.newProductPayload, session);
                            createdProductsMap[tempProductId] = { product, createdItems };
                        }
                        
                        const { product, createdItems } = createdProductsMap[tempProductId];
                        item.product = product._id;
                        // If the payload specifies which variant row this item corresponds to, 
                        // we link it. If it's a single product, there's only 1 createdItem.
                        if (createdItems.length > 0) {
                            // Find the corresponding variant if sku matches, or just use the first one
                            const matchedVariant = createdItems.find(ci => ci.sku === item.sku) || createdItems[0];
                            item.variant = matchedVariant._id;
                        } else {
                            // Remove temp variant ID if no created items were returned to avoid cast errors
                            item.variant = undefined;
                        }
                        // Remove the massive payload so it doesn't get saved to DB
                        item.newProductPayload = undefined;
                    }
                }
            }

            const purchase = new Purchase(body);

            // Compute each item's pricing
            for (const item of purchase.items) {
                await computeItemPricing(item);
            }
            computePurchaseTotals(purchase);

            await purchase.save({ session });

            // If created directly in an inward status, apply stock movements
            if (INWARD_STATUSES.includes(purchase.status)) {
                // Collect IDs of newly created product items so we don't double-count their quantity
                const newlyCreatedVariantIds = new Set();
                const newlyCreatedProductIds = new Set();
                for (const mapEntry of Object.values(createdProductsMap)) {
                    newlyCreatedProductIds.add(mapEntry.product._id.toString());
                    for (const ci of mapEntry.createdItems) {
                        newlyCreatedVariantIds.add(ci._id.toString());
                    }
                }

                for (const item of purchase.items) {
                    const qty = (Number(item.quantity) || 0) + (Number(item.freeQuantity) || 0);
                    await applyMovement({
                        type: 'Purchase',
                        warehouse: purchase.warehouse,
                        product: item.product,
                        variant: item.variant || null,
                        quantity: qty,
                        reference: purchase.purchaseNumber,
                        referenceId: purchase._id,
                        reason: 'Purchase inward'
                    }, session);

                    // Update total quantity on Product and ProductItem
                    // Skip newly created products/variants — they already have correct quantity from createProductTransaction
                    const isNewVariant = item.variant && newlyCreatedVariantIds.has(item.variant.toString());
                    const isNewProduct = newlyCreatedProductIds.has(item.product.toString());

                    if (item.variant && !isNewVariant) {
                        await ProductItem.findByIdAndUpdate(item.variant, { $inc: { quantity: qty } }, { session });
                    }
                    if (item.product && !isNewProduct) {
                        await mongoose.model('Product').findByIdAndUpdate(item.product, { $inc: { quantity: qty } }, { session });
                    }
                }
            }

            await session.commitTransaction();
            session.endSession();
            res.status(201).json(purchase);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            if (error.code === 11000) {
                return res.status(400).json({ error: 'Duplicate purchase/invoice number.' });
            }
            res.status(400).json({ error: error.message });
        }
    },

    // UPDATE + status transition handling (stock movements)
    update: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const existing = await Purchase.findById(req.params.id).session(session);
            if (!existing) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: 'Purchase not found' });
            }

            const wasInward = INWARD_STATUSES.includes(existing.status);
            const newStatus = req.body.status || existing.status;
            const willBeInward = INWARD_STATUSES.includes(newStatus);

            // Create any inline unsaved products before assigning to existing document
            // to avoid Mongoose ObjectId cast errors on temp IDs.
            const updateCreatedProductsMap = {};
            if (req.body.items && Array.isArray(req.body.items)) {
                for (let i = 0; i < req.body.items.length; i++) {
                    const item = req.body.items[i];
                    if (item.newProductPayload) {
                        const tempProductId = item.product;
                        if (!updateCreatedProductsMap[tempProductId]) {
                            const { product, createdItems } = await createProductTransaction(item.newProductPayload, session);
                            updateCreatedProductsMap[tempProductId] = { product, createdItems };
                        }
                        
                        const { product, createdItems } = updateCreatedProductsMap[tempProductId];
                        item.product = product._id;
                        if (createdItems.length > 0) {
                            const matchedVariant = createdItems.find(ci => ci.sku === item.sku) || createdItems[0];
                            item.variant = matchedVariant._id;
                        } else {
                            item.variant = undefined;
                        }
                        item.newProductPayload = undefined;
                    }
                }
            }

            const purchase = Object.assign(existing, req.body);

            // Recompute item pricing + totals
            for (const item of purchase.items) {
                await computeItemPricing(item);
            }
            computePurchaseTotals(purchase);

            await purchase.save({ session });

            // Handle stock transitions
            if (!wasInward && willBeInward) {
                // Transition into inward: add stock
                for (const item of purchase.items) {
                    const qty = (Number(item.quantity) || 0) + (Number(item.freeQuantity) || 0);
                    await applyMovement({
                        type: 'Purchase',
                        warehouse: purchase.warehouse,
                        product: item.product,
                        variant: item.variant || null,
                        quantity: qty,
                        reference: purchase.purchaseNumber,
                        referenceId: purchase._id,
                        reason: 'Purchase inward'
                    }, session);

                    // Update total quantity on Product and ProductItem
                    if (item.variant) {
                        await ProductItem.findByIdAndUpdate(item.variant, { $inc: { quantity: qty } }, { session });
                    }
                    if (item.product) {
                        await mongoose.model('Product').findByIdAndUpdate(item.product, { $inc: { quantity: qty } }, { session });
                    }
                }
            } else if (wasInward && !willBeInward) {
                // Cancelled after inward: reverse stock
                for (const item of purchase.items) {
                    const qty = (Number(item.quantity) || 0) + (Number(item.freeQuantity) || 0);
                    await applyMovement({
                        type: 'Adjustment',
                        warehouse: purchase.warehouse,
                        product: item.product,
                        variant: item.variant || null,
                        quantity: -qty,
                        reference: purchase.purchaseNumber,
                        referenceId: purchase._id,
                        reason: 'Purchase reversed'
                    }, session);

                    // Reverse total quantity on Product and ProductItem
                    if (item.variant) {
                        await ProductItem.findByIdAndUpdate(item.variant, { $inc: { quantity: -qty } }, { session });
                    }
                    if (item.product) {
                        await mongoose.model('Product').findByIdAndUpdate(item.product, { $inc: { quantity: -qty } }, { session });
                    }
                }
            }

            await session.commitTransaction();
            session.endSession();
            res.status(200).json(purchase);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            if (error.code === 11000) {
                return res.status(400).json({ error: 'Duplicate purchase/invoice number.' });
            }
            res.status(400).json({ error: error.message });
        }
    },

    remove: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const purchase = await Purchase.findById(req.params.id).session(session);
            if (!purchase) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: 'Purchase not found' });
            }
            // Reverse stock if it was inward
            if (INWARD_STATUSES.includes(purchase.status)) {
                for (const item of purchase.items) {
                    const qty = (Number(item.quantity) || 0) + (Number(item.freeQuantity) || 0);
                    await applyMovement({
                        type: 'Adjustment',
                        warehouse: purchase.warehouse,
                        product: item.product,
                        variant: item.variant || null,
                        quantity: -qty,
                        reference: purchase.purchaseNumber,
                        referenceId: purchase._id,
                        reason: 'Purchase deleted - stock reversed'
                    }, session);

                    // Reverse total quantity on Product and ProductItem
                    if (item.variant) {
                        await ProductItem.findByIdAndUpdate(item.variant, { $inc: { quantity: -qty } }, { session });
                    }
                    if (item.product) {
                        await mongoose.model('Product').findByIdAndUpdate(item.product, { $inc: { quantity: -qty } }, { session });
                    }
                }
            }
            await Purchase.findByIdAndDelete(req.params.id).session(session);
            await session.commitTransaction();
            session.endSession();
            res.status(200).json({ message: 'Purchase deleted successfully' });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({ error: error.message });
        }
    },

    // DRAFTS only
    getDrafts: async (req, res) => {
        try {
            const drafts = await Purchase.find({ status: 'Draft' })
                .populate('vendor', 'vendorName vendorCode')
                .populate('warehouse', 'name')
                .sort({ createdAt: -1 });
            res.status(200).json(drafts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // APPROVE shortcut
    approve: async (req, res) => {
        try {
            const purchase = await Purchase.findById(req.params.id);
            if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
            
            // If already inward, don't do anything
            if (!INWARD_STATUSES.includes(purchase.status)) {
                purchase.status = 'Approved';
                
                // Add stock since it's now Approved
                for (const item of purchase.items) {
                    const qty = (Number(item.quantity) || 0) + (Number(item.freeQuantity) || 0);
                    await applyMovement({
                        type: 'Purchase',
                        warehouse: purchase.warehouse,
                        product: item.product,
                        variant: item.variant || null,
                        quantity: qty,
                        reference: purchase.purchaseNumber,
                        referenceId: purchase._id,
                        reason: 'Purchase approved - inward'
                    });

                    // Update total quantity on Product and ProductItem
                    if (item.variant) {
                        await ProductItem.findByIdAndUpdate(item.variant, { $inc: { quantity: qty } });
                    }
                    if (item.product) {
                        await mongoose.model('Product').findByIdAndUpdate(item.product, { $inc: { quantity: qty } });
                    }
                }
            }
            
            await purchase.save();
            res.status(200).json(purchase);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = purchaseController;
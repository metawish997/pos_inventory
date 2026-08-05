const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Invoice = require('../models/Invoice');
const Quotation = require('../models/Quotation');
const SalesReturn = require('../models/SalesReturn');
const Stock = require('../models/Stock');
const StockMovement = require('../models/StockMovement');

// Helper for deducting stock
const deductStockForSale = async (sale) => {
    if (!sale.items || sale.items.length === 0) return;
    for (const item of sale.items) {
        if (sale.warehouse) {
            const query = { warehouse: sale.warehouse, product: item.product };
            if (item.variant) query.variant = item.variant;

            const stock = await Stock.findOne(query);
            if (stock) {
                stock.availableQty = Math.max(0, stock.availableQty - item.quantity);
                await stock.save();

                await StockMovement.create({
                    warehouse: sale.warehouse,
                    product: item.product,
                    variant: item.variant,
                    type: 'OUT',
                    quantity: item.quantity,
                    reference: sale.saleNumber,
                    reason: `Sale ${sale.saleType}: ${sale.saleNumber}`
                });
            }
        }
    }
};

// Helper for restoring stock on Return
const restoreStockForReturn = async (salesReturn, warehouseId) => {
    if (!salesReturn.items || salesReturn.items.length === 0) return;
    for (const item of salesReturn.items) {
        if (warehouseId) {
            const query = { warehouse: warehouseId, product: item.product };
            if (item.variant) query.variant = item.variant;

            const stock = await Stock.findOne(query);
            if (stock) {
                stock.availableQty += item.quantity;
                await stock.save();

                await StockMovement.create({
                    warehouse: warehouseId,
                    product: item.product,
                    variant: item.variant,
                    type: 'IN',
                    quantity: item.quantity,
                    reference: salesReturn.returnNumber,
                    reason: `Sales Return: ${salesReturn.returnNumber}`
                });
            }
        }
    }
};

// --- SALES API CONTROLLERS ---

exports.getSales = async (req, res) => {
    try {
        const { type } = req.query;
        const query = {};
        if (type) query.saleType = type;

        const sales = await Sale.find(query)
            .populate('items.product', 'name code price sellingPrice image hsnCode')
            .populate('warehouse', 'name')
            .populate('store', 'name')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: sales });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('items.product')
            .populate('warehouse')
            .populate('store');

        if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
        res.json({ success: true, data: sale });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createSale = async (req, res) => {
    try {
        const sale = new Sale(req.body);
        await sale.save();

        if (sale.orderStatus === 'Completed') {
            await deductStockForSale(sale);
        }

        const invoice = new Invoice({
            sale: sale._id,
            customerName: sale.customerName,
            customerEmail: sale.customerEmail,
            customerPhone: sale.customerPhone,
            gstNumber: sale.gstNumber || '',
            placeOfSupply: sale.placeOfSupply || '',
            clientPoNumber: sale.clientPoNumber || '',
            invoiceType: req.body.invoiceType || 'Tax Invoice',
            invoiceNumber: req.body.invoiceNumber,
            invoiceDate: req.body.invoiceDate || Date.now(),
            dueDate: req.body.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            subtotal: sale.subtotal,
            taxAmount: sale.totalTax,
            discountAmount: sale.totalDiscount,
            totalAmount: sale.grandTotal,
            paidAmount: sale.paidAmount,
            dueAmount: sale.dueAmount,
            status: sale.paymentStatus === 'Paid' ? 'Paid' : (sale.paidAmount > 0 ? 'Partially Paid' : 'Unpaid'),
            notes: req.body.notes || '',
            terms: sale.terms,
            customFields: sale.customFields,
            attachments: sale.attachments,
            organization: sale.organization || null,
            payments: sale.paidAmount > 0 ? [{
                amount: sale.paidAmount,
                paymentDate: sale.saleDate || Date.now(),
                referenceNumber: 'Initial POS Payment'
            }] : []
        });
        await invoice.save();

        const Notification = require('../models/Notification');
        const dbNotification = new Notification({
          type: 'SALE_COMPLETED',
          title: 'New POS Sale Completed',
          message: `Sale #${sale.saleNumber || 'Order'} created for ${sale.customerName || 'Walk-in'} (₹${sale.grandTotal})`
        });
        await dbNotification.save();

        const eventService = require('../services/eventService');
        eventService.broadcast({
          type: 'SALE_COMPLETED',
          id: dbNotification._id,
          title: dbNotification.title,
          desc: dbNotification.message,
          time: 'Just now'
        });

        res.status(201).json({ success: true, data: sale, invoice });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
        res.json({ success: true, data: sale });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);
        if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
        res.json({ success: true, message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- INVOICES CONTROLLERS ---

exports.getInvoices = async (req, res) => {
    try {
        const { type } = req.query;
        const query = {};
        if (type) {
            if (type === 'Tax Invoice') {
                query.$or = [
                    { invoiceType: 'Tax Invoice' },
                    { invoiceType: { $exists: false } }
                ];
            } else {
                query.invoiceType = type;
            }
        }
        const invoices = await Invoice.find(query).populate('sale').populate('organization').sort({ createdAt: -1 });
        res.json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('organization')
            .populate({
                path: 'sale',
                populate: {
                    path: 'items.product'
                }
            });
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        res.json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        res.json({ success: true, data: invoice });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        res.json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- QUOTATIONS CONTROLLERS ---

exports.getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find().populate('items.product').populate('organization').sort({ createdAt: -1 });
        res.json({ success: true, data: quotations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getQuotationById = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id).populate('items.product').populate('organization');
        if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
        res.json({ success: true, data: quotation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createQuotation = async (req, res) => {
    try {
        const quotation = new Quotation(req.body);
        await quotation.save();
        res.status(201).json({ success: true, data: quotation });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
        res.json({ success: true, data: quotation });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- SALES RETURNS CONTROLLERS ---

exports.getSalesReturns = async (req, res) => {
    try {
        const returns = await SalesReturn.find().populate('sale').populate('items.product').sort({ createdAt: -1 });
        res.json({ success: true, data: returns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createSalesReturn = async (req, res) => {
    try {
        const salesReturn = new SalesReturn(req.body);
        await salesReturn.save();

        let warehouseId = null;
        if (salesReturn.sale) {
            const originalSale = await Sale.findById(salesReturn.sale);
            if (originalSale) warehouseId = originalSale.warehouse;
        }

        await restoreStockForReturn(salesReturn, warehouseId);

        res.status(201).json({ success: true, data: salesReturn });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateSalesReturn = async (req, res) => {
    try {
        const salesReturn = await SalesReturn.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!salesReturn) return res.status(404).json({ success: false, message: 'Sales return not found' });
        res.json({ success: true, data: salesReturn });
    } catch (error) {
        const message = error.message;
        res.status(400).json({ success: false, message });
    }
};

exports.recordInvoicePayment = async (req, res) => {
    try {
        const { amount, paymentDate, referenceNumber } = req.body;
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

        const paymentAmount = Number(amount) || 0;
        invoice.paidAmount = (invoice.paidAmount || 0) + paymentAmount;
        invoice.dueAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);
        
        if (invoice.dueAmount <= 0) {
            invoice.status = 'Paid';
        } else if (invoice.paidAmount > 0) {
            invoice.status = 'Partially Paid';
        } else {
            invoice.status = 'Unpaid';
        }

        if (paymentDate) {
            invoice.notes = `${invoice.notes || ''}\n[Payment received: ₹${paymentAmount} on ${new Date(paymentDate).toLocaleDateString()}${referenceNumber ? ` (Ref: ${referenceNumber})` : ''}]`.trim();
        }

        // Push to payments array
        invoice.payments.push({
            amount: paymentAmount,
            paymentDate: paymentDate || new Date(),
            referenceNumber: referenceNumber || ''
        });

        await invoice.save();

        // Update the linked Sale if it exists
        if (invoice.sale) {
            const sale = await Sale.findById(invoice.sale);
            if (sale) {
                sale.paidAmount = (sale.paidAmount || 0) + paymentAmount;
                sale.dueAmount = Math.max(0, sale.grandTotal - sale.paidAmount);
                if (sale.dueAmount <= 0) {
                    sale.paymentStatus = 'Paid';
                } else if (sale.paidAmount > 0) {
                    sale.paymentStatus = 'Partial';
                } else {
                    sale.paymentStatus = 'Unpaid';
                }
                await sale.save();
            }
        }

        res.json({ success: true, data: invoice });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.convertProformaToTaxInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        if (invoice.invoiceType !== 'Proforma Invoice') {
            return res.status(400).json({ success: false, message: 'Only Proforma Invoices can be converted to Tax Invoices' });
        }
        
        invoice.invoiceType = 'Tax Invoice';
        // Generate new invoice number
        const count = await Invoice.countDocuments({ invoiceType: 'Tax Invoice' });
        invoice.invoiceNumber = `INV-${String(count + 1).padStart(4, '0')}`;
        await invoice.save();

        res.json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBestSellers = async (req, res) => {
    try {
        const { startDate, endDate, storeId, productId } = req.query;
        
        const match = { orderStatus: 'Completed' };
        
        if (startDate || endDate) {
            match.saleDate = {};
            if (startDate) match.saleDate.$gte = new Date(startDate);
            if (endDate) match.saleDate.$lte = new Date(endDate);
        }
        
        if (storeId && storeId !== 'All') {
            match.store = new mongoose.Types.ObjectId(storeId);
        }
        
        const pipeline = [
            { $match: match },
            { $unwind: '$items' }
        ];
        
        if (productId && productId !== 'All') {
            pipeline.push({
                $match: { 'items.product': new mongoose.Types.ObjectId(productId) }
            });
        }
        
        pipeline.push(
            {
                $group: {
                    _id: '$items.product',
                    sku: { $first: '$items.sku' },
                    soldQty: { $sum: '$items.quantity' },
                    soldAmount: { $sum: '$items.total' }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'productInfo.brand',
                    foreignField: '_id',
                    as: 'brandInfo'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productInfo.category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $project: {
                    _id: 1,
                    sku: { $ifNull: ['$sku', '$productInfo.sku'] },
                    name: '$productInfo.name',
                    brand: { $ifNull: [{ $arrayElemAt: ['$brandInfo.name', 0] }, 'N/A'] },
                    category: { $ifNull: [{ $arrayElemAt: ['$categoryInfo.name', 0] }, 'N/A'] },
                    soldQty: 1,
                    soldAmount: 1,
                    instockQty: '$productInfo.quantity',
                    img: { $arrayElemAt: ['$productInfo.images', 0] }
                }
            },
            { $sort: { soldQty: -1 } }
        );
        
        const results = await Sale.aggregate(pipeline);
        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getInvoiceReport = async (req, res) => {
    try {
        const { startDate, endDate, customerName, status } = req.query;

        const match = {};

        if (startDate || endDate) {
            match.invoiceDate = {};
            if (startDate) match.invoiceDate.$gte = new Date(startDate);
            if (endDate) match.invoiceDate.$lte = new Date(endDate);
        }

        if (customerName && customerName !== 'All') {
            match.customerName = customerName;
        }

        if (status && status !== 'All') {
            match.status = status;
        }

        const invoices = await Invoice.find(match).populate('sale').sort({ invoiceDate: -1 });

        const now = new Date();
        const summaryStats = await Invoice.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$totalAmount' },
                    totalPaid: { $sum: '$paidAmount' },
                    totalUnpaid: { $sum: '$dueAmount' },
                    overdue: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $lt: ['$dueDate', now] },
                                        { $ne: ['$status', 'Paid'] }
                                    ]
                                },
                                '$dueAmount',
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const summary = summaryStats[0] || {
            totalAmount: 0,
            totalPaid: 0,
            totalUnpaid: 0,
            overdue: 0
        };

        const uniqueCustomers = await Invoice.distinct('customerName');

        res.json({
            success: true,
            data: {
                invoices,
                summary,
                customers: uniqueCustomers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



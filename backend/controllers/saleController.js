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
            .populate('items.product', 'name code price sellingPrice image')
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
            subtotal: sale.subtotal,
            taxAmount: sale.totalTax,
            discountAmount: sale.totalDiscount,
            totalAmount: sale.grandTotal,
            paidAmount: sale.paidAmount,
            dueAmount: sale.dueAmount,
            status: sale.paymentStatus === 'Paid' ? 'Paid' : (sale.paidAmount > 0 ? 'Partially Paid' : 'Unpaid')
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
        const invoices = await Invoice.find().populate('sale').sort({ createdAt: -1 });
        res.json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- QUOTATIONS CONTROLLERS ---

exports.getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find().populate('items.product').sort({ createdAt: -1 });
        res.json({ success: true, data: quotations });
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
        res.status(400).json({ success: false, message: error.message });
    }
};

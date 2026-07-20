const Purchase = require('../models/Purchase');
const PurchaseReturn = require('../models/PurchaseReturn');
const Vendor = require('../models/Vendor');

const purchaseReportController = {
    // Vendor purchase summary
    vendorPurchaseReport: async (req, res) => {
        try {
            const { from, to } = req.query;
            const dateFilter = {};
            if (from || to) {
                dateFilter.purchaseDate = {};
                if (from) dateFilter.purchaseDate.$gte = new Date(from);
                if (to) dateFilter.purchaseDate.$lte = new Date(to);
            }
            const purchases = await Purchase.find(dateFilter).populate('vendor', 'vendorName vendorCode');
            const map = {};
            purchases.forEach((p) => {
                const key = p.vendor ? p.vendor._id.toString() : 'unknown';
                if (!map[key]) {
                    map[key] = {
                        vendor: p.vendor ? p.vendor.vendorName : 'Unknown',
                        vendorCode: p.vendor ? p.vendor.vendorCode : '',
                        purchaseCount: 0,
                        totalAmount: 0
                    };
                }
                map[key].purchaseCount += 1;
                map[key].totalAmount += p.grandTotal || 0;
            });
            res.status(200).json(Object.values(map));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Purchase summary (status breakdown + totals)
    purchaseSummary: async (req, res) => {
        try {
            const purchases = await Purchase.find();
            const summary = {
                total: purchases.length,
                totalAmount: 0,
                byStatus: {}
            };
            purchases.forEach((p) => {
                summary.totalAmount += p.grandTotal || 0;
                summary.byStatus[p.status] = (summary.byStatus[p.status] || 0) + 1;
            });
            summary.totalAmount = Number(summary.totalAmount.toFixed(2));
            res.status(200).json(summary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GST summary (tax collected per tax rate)
    gstSummary: async (req, res) => {
        try {
            const purchases = await Purchase.find();
            const map = {};
            purchases.forEach((p) => {
                p.items.forEach((it) => {
                    const rate = it.taxRate || 0;
                    if (!map[rate]) map[rate] = { taxRate: rate, taxable: 0, taxAmount: 0 };
                    map[rate].taxable += (it.subtotal - (it.discountType ? 0 : 0)) || 0;
                    map[rate].taxAmount += it.taxAmount || 0;
                });
            });
            Object.values(map).forEach((m) => {
                m.taxable = Number(m.taxable.toFixed(2));
                m.taxAmount = Number(m.taxAmount.toFixed(2));
            });
            res.status(200).json(Object.values(map));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Warehouse purchase report
    warehousePurchaseReport: async (req, res) => {
        try {
            const purchases = await Purchase.find().populate('warehouse', 'name');
            const map = {};
            purchases.forEach((p) => {
                const key = p.warehouse ? p.warehouse._id.toString() : 'unknown';
                if (!map[key]) {
                    map[key] = {
                        warehouse: p.warehouse ? p.warehouse.name : 'Unknown',
                        purchaseCount: 0,
                        totalAmount: 0
                    };
                }
                map[key].purchaseCount += 1;
                map[key].totalAmount += p.grandTotal || 0;
            });
            Object.values(map).forEach((m) => { m.totalAmount = Number(m.totalAmount.toFixed(2)); });
            res.status(200).json(Object.values(map));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Purchase return report
    purchaseReturnReport: async (req, res) => {
        try {
            const returns = await PurchaseReturn.find()
                .populate('vendor', 'vendorName vendorCode')
                .populate('warehouse', 'name');
            const total = returns.reduce((acc, r) => acc + (r.totalReturnAmount || 0), 0);
            res.status(200).json({ count: returns.length, totalReturnAmount: Number(total.toFixed(2)), returns });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = purchaseReportController;
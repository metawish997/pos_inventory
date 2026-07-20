const Vendor = require('../models/Vendor');

// Reusable CRUD for Vendor (keeps controllers clean, logic in services where needed)
const vendorController = {
    getAll: async (req, res) => {
        try {
            const { search, status } = req.query;
            const filter = {};
            if (search) {
                filter.$or = [
                    { vendorName: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } },
                    { vendorCode: { $regex: search, $options: 'i' } },
                    { gstin: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { mobile: { $regex: search, $options: 'i' } }
                ];
            }
            if (status) filter.status = status;
            const vendors = await Vendor.find(filter).sort({ createdAt: -1 });
            res.status(200).json(vendors);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const vendor = await Vendor.findById(req.params.id);
            if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
            res.status(200).json(vendor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const vendor = new Vendor(req.body);
            await vendor.save();
            res.status(201).json(vendor);
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ error: 'A vendor with this code already exists.' });
            }
            res.status(400).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
            res.status(200).json(vendor);
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ error: 'A vendor with this code already exists.' });
            }
            res.status(400).json({ error: error.message });
        }
    },

    remove: async (req, res) => {
        try {
            const vendor = await Vendor.findByIdAndDelete(req.params.id);
            if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
            res.status(200).json({ message: 'Vendor deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = vendorController;
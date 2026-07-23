const DeliveryChallan = require('../models/DeliveryChallan');

exports.getAll = async (req, res) => {
    try {
        const { search, status } = req.query;
        const query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { challanNumber: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } }
            ];
        }
        const challans = await DeliveryChallan.find(query).populate('items.product').sort({ createdAt: -1 });
        res.json({ success: true, data: challans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const challan = await DeliveryChallan.findById(req.params.id).populate('items.product');
        if (!challan) return res.status(404).json({ success: false, message: 'Delivery Challan not found' });
        res.json({ success: true, data: challan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const challan = new DeliveryChallan(req.body);
        await challan.save();
        res.status(201).json({ success: true, data: challan });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const challan = await DeliveryChallan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!challan) return res.status(404).json({ success: false, message: 'Delivery Challan not found' });
        res.json({ success: true, data: challan });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const challan = await DeliveryChallan.findByIdAndDelete(req.params.id);
        if (!challan) return res.status(404).json({ success: false, message: 'Delivery Challan not found' });
        res.json({ success: true, message: 'Delivery Challan deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

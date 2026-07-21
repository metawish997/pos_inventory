const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const DeleteAccountRequest = require('../models/DeleteAccountRequest');

// --- USERS CONTROLLERS ---
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role').select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, phone, role, password, status } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const user = new User({
            name,
            email,
            phone: phone || '',
            role: role || null,
            password: password || '123456',
            status: status || 'Active'
        });

        await user.save();
        res.status(201).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- ROLES & PERMISSIONS CONTROLLERS ---
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.json({ success: true, data: roles });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json({ success: true, data: role });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// --- DELETE ACCOUNT REQUESTS CONTROLLERS ---
exports.getDeleteRequests = async (req, res) => {
    try {
        const requests = await DeleteAccountRequest.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createDeleteRequest = async (req, res) => {
    try {
        const request = new DeleteAccountRequest(req.body);
        await request.save();
        res.status(201).json({ success: true, data: request });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.processDeleteRequest = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await DeleteAccountRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (status === 'Approved' && request.user) {
            await User.findByIdAndDelete(request.user);
        }
        res.json({ success: true, data: request });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

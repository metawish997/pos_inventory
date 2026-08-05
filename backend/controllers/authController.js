const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const CompanySetting = require('../models/CompanySetting');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

const sendEmail = async (options) => {
    const settings = await CompanySetting.findOne();

    const host = (settings && settings.smtpHost) ? settings.smtpHost : process.env.SMTP_HOST;
    const port = (settings && settings.smtpPort) ? parseInt(settings.smtpPort) : parseInt(process.env.SMTP_PORT || '587');
    const secure = (settings && settings.smtpSecure !== undefined) ? settings.smtpSecure : (process.env.SMTP_SECURE === 'true');
    const user = (settings && settings.smtpUser) ? settings.smtpUser : process.env.SMTP_USER;
    const pass = (settings && settings.smtpPass) ? settings.smtpPass : process.env.SMTP_PASS;
    const from = (settings && settings.smtpFrom) ? settings.smtpFrom : (process.env.SMTP_FROM || user);

    if (!host || !user || !pass) {
        throw new Error('SMTP settings are not configured. Please set them up in POS Settings.');
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    });

    const mailOptions = {
        from,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        if (!firstName || !lastName || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const userRole = await Role.findOne({ name: 'user' }).populate('permissions');
        if (!userRole) {
            return res.status(500).json({ message: 'Default user role not found. Please run the seeder first.' });
        }

        const user = await User.create({ firstName, lastName, email, phone, password, role: userRole._id });

        res.status(201).json({
            message: 'Registration successful',
            token: generateToken(user._id),
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: { ...userRole.toObject() },
                status: user.status,
                emailVerified: user.emailVerified
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email }).populate({
            path: 'role',
            populate: { path: 'permissions', model: 'Permission' }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Your account is currently inactive or suspended.' });
        }

        res.status(200).json({
            message: 'Login successful',
            token: generateToken(user._id),
            user: {
                id: user._id,
                fullName: user.fullName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    res.status(200).json({ user: req.user });
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { firstName, lastName, name, phone, email, password } = req.body;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (name && !firstName) user.name = name;
        if (phone) user.phone = phone;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();
        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const message = `You requested a password reset. Your OTP is: ${otp}\n\nThis OTP is valid for 15 minutes.`;
        const html = `
            <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; border-radius: 8px;">
                <h2 style="color: #1B2850; margin-bottom: 20px;">EronixPOS Password Reset</h2>
                <p>You requested to reset your password. Please use the following One-Time Password (OTP) to reset it:</p>
                <div style="background-color: #F8F9FA; padding: 15px; border-radius: 6px; font-size: 24px; font-weight: bold; text-align: center; color: #FF9F43; letter-spacing: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">This OTP is valid for 15 minutes. If you did not request this, please ignore this email.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'EronixPOS Password Reset OTP',
                message,
                html
            });
            res.status(200).json({ message: 'OTP sent to email successfully' });
        } catch (err) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return res.status(500).json({ message: `Failed to send email: ${err.message}` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Set new password (pre-save middleware handles hashing)
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, getMe, updateProfile, forgotPassword, resetPassword };

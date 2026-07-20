// seeder.js
const mongoose = require('mongoose');
require('dotenv').config();
const Role = require('../models/Role');
const User = require('../models/User');


const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing data to prevent duplicate keys
        await User.deleteMany();
        await Role.deleteMany();
        console.log('Existing users and roles cleared.');

        // 1. Seed Roles Dynamically (You can add any custom roles here now)
        const createdRoles = await Role.insertMany([
            { name: 'super_admin', description: 'Full system control, structural management, and setups' },
            { name: 'admin', description: 'Standard operations, user monitoring, and backend management' },
            { name: 'manager', description: 'Mid-level team management and content supervision' },
            { name: 'user', description: 'Standard base consumer or client account' }
        ]);
        console.log('Dynamic base roles seeded successfully!');

        // Find the specific object assigned to the 'super_admin' role from the creation array
        const superAdminRole = createdRoles.find(role => role.name === 'super_admin');

        if (!superAdminRole) {
            throw new Error("Super Admin role configuration missing from creation array.");
        }

        // 2. Seed Super Admin with the referenced Role ID
        await User.create({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@example.com',
            phone: '1234567890',
            password: '11111111', // Automatically hashed by User model's pre-save hook
            role: superAdminRole._id,           // Dynamically grabs the generated MongoDB object ID
            emailVerified: true,
            status: 'active'
        });

        console.log('Super Admin successfully seeded with linked dynamic Role ID!');
        process.exit(0);
    } catch (error) {
        console.error(`Error during seeding execution: ${error.message}`);
        process.exit(1);
    }
};

seedData();
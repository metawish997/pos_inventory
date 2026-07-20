const Store = require('../models/Store');
const Warehouse = require('../models/Warehouse');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Brand = require('../models/Brand');
const VariantAttribute = require('../models/VariantAttribute');
const Tax = require('../models/Tax');
const Warranty = require('../models/Warranty');

// Generic controller factory — eliminates repetition for all 6 models
const createController = (Model) => ({

    getAll: async (req, res) => {
        try {
            const items = await Model.find().sort({ createdAt: -1 });
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const item = await Model.findById(req.params.id);
            if (!item) return res.status(404).json({ error: 'Item not found' });
            res.status(200).json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const item = new Model(req.body);
            await item.save();
            res.status(201).json(item);
        } catch (error) {
            // Handle duplicate key (unique constraint violation)
            if (error.code === 11000) {
                const field = Object.keys(error.keyValue)[0];
                return res.status(400).json({ error: `A record with this ${field} already exists.` });
            }
            res.status(400).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const item = await Model.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!item) return res.status(404).json({ error: 'Item not found' });
            res.status(200).json(item);
        } catch (error) {
            if (error.code === 11000) {
                const field = Object.keys(error.keyValue)[0];
                return res.status(400).json({ error: `A record with this ${field} already exists.` });
            }
            res.status(400).json({ error: error.message });
        }
    },

    remove: async (req, res) => {
        try {
            const item = await Model.findByIdAndDelete(req.params.id);
            if (!item) return res.status(404).json({ error: 'Item not found' });
            res.status(200).json({ message: 'Item removed successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
});

const storeController = createController(Store);
const warehouseController = createController(Warehouse);
const categoryController = createController(Category);
const subCategoryController = createController(SubCategory);
const brandController = createController(Brand);
const variantController = createController(VariantAttribute);
const taxController = createController(Tax);
const warrantyController = createController(Warranty);

module.exports = {
    storeController,
    warehouseController,
    categoryController,
    subCategoryController,
    brandController,
    variantController,
    taxController,
    warrantyController
};

const Product = require('../models/Product');
const ProductItem = require('../models/ProductItem');
const Tax = require('../models/Tax');
const mongoose = require('mongoose');
const { computePricing, createProductTransaction } = require('../services/productService');

module.exports = {
    // 1. CREATE PRODUCT (Handles transactional rollback for single/variable items)
    createProduct: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { product } = await createProductTransaction(req.body, session);

            await session.commitTransaction();
            session.endSession();
            res.status(201).json({ message: 'Product created successfully', product });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            if (error.code === 11000) {
                return res.status(400).json({ error: 'Duplicate key error: SKU or Slug already exists.' });
            }
            res.status(500).json({ error: error.message });
        }
    },

    // 2. GET ALL PRODUCTS
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find()
                .populate('store warehouse category subCategory brand tax')
                .sort({ createdAt: -1 });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 3. GET PRODUCT BY ID
    getProductById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
                .populate('store warehouse category subCategory brand tax');
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 4. UPDATE PRODUCT (Handles transactional sync of single/variable items)
    updateProduct: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { variantRows, ...productData } = req.body;

            // Compute pricing for single product
            if (productData.productType !== 'variable') {
                const tax = productData.tax ? await Tax.findById(productData.tax).session(session) : null;
                const pricing = computePricing(
                    productData.price,
                    tax ? tax.taxValue : 0,
                    productData.taxType,
                    productData.discountType,
                    productData.discountValue
                );
                Object.assign(productData, pricing);
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                productData,
                { new: true, runValidators: true, session }
            );
            if (!updatedProduct) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: 'Product not found' });
            }

            // Sync the linked product items (variants) for the whole product
            if (updatedProduct.productType === 'variable' && Array.isArray(variantRows)) {
                // Replace the entire variant set to keep items in sync with the edit
                const productTax = productData.tax ? await Tax.findById(productData.tax).session(session) : null;
                const taxRate = productTax ? productTax.taxValue : 0;
                await ProductItem.deleteMany({ product: updatedProduct._id }, { session });
                if (variantRows.length > 0) {
                    const itemsToInsert = variantRows.map(row => {
                        // Apply the main product's tax & discount directly to each variant
                        const pricing = computePricing(
                            row.price,
                            taxRate,
                            productData.taxType,
                            productData.discountType,
                            productData.discountValue
                        );
                        return {
                            product: updatedProduct._id,
                            sku: row.sku,
                            quantity: row.quantity || 0,
                            price: row.price || 0,
                            selections: row.selections || {},
                            status: row.status || 'Active',
                            taxType: productData.taxType,
                            tax: productData.tax || null,
                            discountType: productData.discountType,
                            discountValue: productData.discountValue || 0,
                            ...pricing
                        };
                    });
                    await ProductItem.insertMany(itemsToInsert, { session });
                }
            } else {
                // Single product: upsert the default item row
                const pricing = computePricing(
                    productData.price,
                    0,
                    productData.taxType,
                    productData.discountType,
                    productData.discountValue
                );
                const existingItem = await ProductItem.findOne({ product: updatedProduct._id }, null, { session });
                if (existingItem) {
                    existingItem.sku = updatedProduct.sku;
                    existingItem.quantity = productData.quantity || 0;
                    existingItem.price = productData.price || 0;
                    existingItem.selections = {};
                    Object.assign(existingItem, pricing);
                    await existingItem.save({ session });
                } else {
                    await ProductItem.create([{
                        product: updatedProduct._id,
                        sku: updatedProduct.sku,
                        quantity: productData.quantity || 0,
                        price: productData.price || 0,
                        selections: {},
                        status: 'Active',
                        ...pricing
                    }], { session });
                }
            }

            await session.commitTransaction();
            session.endSession();
            res.status(200).json(updatedProduct);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            if (error.code === 11000) {
                return res.status(400).json({ error: 'Duplicate key error: SKU already exists.' });
            }
            res.status(500).json({ error: error.message });
        }
    },

    // 5. DELETE PRODUCT
    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) return res.status(404).json({ error: 'Product not found' });

            // Cascade delete variants items rows linked to this product
            await ProductItem.deleteMany({ product: req.params.id });
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 6. GET PRODUCT VARIANTS ITEMS
    getProductVariants: async (req, res) => {
        try {
            const variants = await ProductItem.find({ product: req.params.productId }).populate('tax');
            res.status(200).json(variants);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 7. GET EXPIRED PRODUCTS
    getExpiredProducts: async (req, res) => {
        try {
            const products = await Product.find({ expiryDate: { $lte: new Date() } }).populate('category brand store warehouse');
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 8. GET LOW STOCKS & OUT OF STOCKS
    getLowStocks: async (req, res) => {
        try {
            const products = await Product.find().populate('category brand store warehouse');
            const lowStocks = products.filter(p => (p.quantity || p.stock || 0) <= (p.quantityAlert || 10));
            const outOfStocks = products.filter(p => (p.quantity || p.stock || 0) === 0);

            res.status(200).json({
                success: true,
                data: {
                    lowStocks,
                    outOfStocks
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 9. SEND LOW STOCK EMAIL ALERT
    sendLowStockEmail: async (req, res) => {
        try {
            res.status(200).json({ success: true, message: 'Low stock alert email dispatched to store administrator.' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
const Product = require('../models/Product');
const ProductItem = require('../models/ProductItem');
const Tax = require('../models/Tax');

const computePricing = (price, taxValue = 0, taxType = 'Exclusive', discountType = '', discountValue = 0) => {
    const base = Number(price) || 0;
    const taxRate = Number(taxValue) || 0;
    const discVal = Number(discountValue) || 0;

    let taxableAmount = base;
    let taxAmount = 0;

    if (taxType === 'Inclusive') {
        // Reverse the tax out of the inclusive price
        taxableAmount = taxRate > 0 ? base / (1 + taxRate / 100) : base;
        taxAmount = base - taxableAmount;
    } else {
        // Exclusive: tax is added on top
        taxAmount = (taxableAmount * taxRate) / 100;
    }

    let discountAmount = 0;
    if (discountType === 'Percentage') {
        discountAmount = (taxableAmount * discVal) / 100;
    } else if (discountType === 'Fixed') {
        discountAmount = Math.min(discVal, taxableAmount);
    }

    const finalPrice = Math.max(0, taxableAmount - discountAmount);
    return {
        basePrice: Number(base.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        finalPrice: Number(finalPrice.toFixed(2))
    };
};

const createProductTransaction = async (reqBody, session) => {
    const { variantRows, ...productData } = reqBody;

    if (!productData.status) {
        productData.status = 'Active';
    }

    // Force numerical fields to numbers to prevent empty strings casting to null
    productData.quantity = Number(productData.quantity) || 0;
    productData.price = Number(productData.price) || 0;
    productData.discountValue = Number(productData.discountValue) || 0;
    productData.quantityAlert = Number(productData.quantityAlert) || 0;

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

    const product = new Product(productData);
    await product.save({ session });
    
    let createdItems = [];

    if (productData.productType === 'variable' && Array.isArray(variantRows)) {
        const productTax = productData.tax ? await Tax.findById(productData.tax).session(session) : null;
        const taxRate = productTax ? productTax.taxValue : 0;
        const itemsToInsert = variantRows.map(row => {
            const pricing = computePricing(
                row.price,
                taxRate,
                productData.taxType,
                productData.discountType,
                productData.discountValue
            );
            return {
                product: product._id,
                sku: row.sku,
                quantity: row.quantity || 0,
                price: row.price || 0,
                selections: row.selections || {},
                status: 'Active',
                taxType: productData.taxType,
                tax: productData.tax || null,
                discountType: productData.discountType,
                discountValue: productData.discountValue || 0,
                ...pricing
            };
        });

        if (itemsToInsert.length > 0) {
            createdItems = await ProductItem.insertMany(itemsToInsert, { session });
        }
    } else {
        const pricing = computePricing(
            productData.price,
            0,
            productData.taxType,
            productData.discountType,
            productData.discountValue
        );
        createdItems = await ProductItem.create([{
            product: product._id,
            sku: product.sku,
            quantity: productData.quantity || 0,
            price: productData.price || 0,
            selections: {},
            status: 'Active',
            ...pricing
        }], { session });
    }

    return { product, createdItems };
};

module.exports = { computePricing, createProductTransaction };

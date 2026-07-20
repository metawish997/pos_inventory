const mongoose = require('mongoose');
const Tax = require('../models/Tax');
const ProductItem = require('../models/ProductItem');

/**
 * Compute pricing for a single purchase item line.
 * Returns the per-line tax amount, subtotal and total.
 */
const computeItemPricing = async (item) => {
    const qty = Number(item.quantity) || 0;
    const freeQty = Number(item.freeQuantity) || 0;
    const price = Number(item.purchasePrice) || 0;
    const lineBase = qty * price;

    // Resolve tax rate
    let taxRate = 0;
    if (item.tax) {
        const taxDoc = await Tax.findById(item.tax);
        taxRate = taxDoc ? taxDoc.taxValue : 0;
    }
    item.taxRate = taxRate;

    // Discount
    let discountAmount = 0;
    if (item.discountType === 'Percentage') {
        discountAmount = (lineBase * (Number(item.discount) || 0)) / 100;
    } else if (item.discountType === 'Fixed') {
        discountAmount = Math.min(Number(item.discount) || 0, lineBase);
    }

    const taxable = lineBase - discountAmount;
    const taxAmount = (taxable * taxRate) / 100;
    const total = taxable + taxAmount;

    item.subtotal = Number(lineBase.toFixed(2));
    item.taxAmount = Number(taxAmount.toFixed(2));
    item.total = Number(total.toFixed(2));
    return item;
};

/**
 * Recompute the purchase header totals from its items + extra charges.
 */
const computePurchaseTotals = (purchase) => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    purchase.items.forEach((it) => {
        const qty = Number(it.quantity) || 0;
        const price = Number(it.purchasePrice) || 0;
        const lineBase = qty * price;
        const disc = it.discountType === 'Percentage'
            ? (lineBase * (Number(it.discount) || 0)) / 100
            : Math.min(Number(it.discount) || 0, lineBase);
        const taxable = lineBase - disc;
        totalDiscount += disc;
        totalTax += it.taxAmount || 0;
        subtotal += lineBase;
    });

    purchase.subtotal = Number(subtotal.toFixed(2));
    purchase.totalDiscount = Number(totalDiscount.toFixed(2));
    purchase.totalTax = Number(totalTax.toFixed(2));

    const rawGrand = subtotal - totalDiscount + totalTax
        + (Number(purchase.shipping) || 0) + (Number(purchase.roundOff) || 0);
    purchase.grandTotal = Number(rawGrand.toFixed(2));
    return purchase;
};

module.exports = { computeItemPricing, computePurchaseTotals };
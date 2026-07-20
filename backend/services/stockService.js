const Stock = require('../models/Stock');
const StockMovement = require('../models/StockMovement');

/**
 * Apply a stock movement and update the running balance for a warehouse + variant.
 * Never updates stock directly — always creates movement history.
 *
 * @param {Object} params
 * @param {string} params.type - Movement type (Purchase, Sale, Return, Transfer, Adjustment, Opening Stock)
 * @param {string} params.warehouse - Warehouse ObjectId
 * @param {string} params.product - Product ObjectId
 * @param {string} [params.variant] - ProductItem ObjectId (optional for single products)
 * @param {number} params.quantity - Signed quantity (+ inward, - outward)
 * @param {string} [params.reference] - Human readable reference (purchase number etc.)
 * @param {string} [params.referenceId] - ObjectId of the source document
 * @param {string} [params.reason]
 * @param {Date}   [params.date]
 * @param {Object} [params.session] - mongoose session for transactions
 */
const applyMovement = async (params, session = null) => {
    const {
        type, warehouse, product, variant = null,
        quantity, reference = '', referenceId = null, reason = '', date = new Date()
    } = params;

    const qty = Number(quantity) || 0;

    // Find or create the stock record for this warehouse + variant
    const filter = variant
        ? { warehouse, variant }
        : { warehouse, product, variant: null };

    let stock = await Stock.findOne(filter).session(session || null);
    if (!stock) {
        stock = new Stock({ warehouse, product, variant, availableQty: 0, reservedQty: 0, damagedQty: 0 });
    }

    const previousAvailable = stock.availableQty;
    stock.availableQty = Math.max(0, previousAvailable + qty);
    await stock.save({ session: session || null });

    const movement = new StockMovement({
        type,
        reference,
        referenceId,
        warehouse,
        product,
        variant,
        quantity: qty,
        balanceAfter: stock.availableQty,
        reason,
        date
    });
    await movement.save({ session: session || null });

    return { stock, movement };
};

module.exports = { applyMovement };
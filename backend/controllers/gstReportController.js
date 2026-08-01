const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const CompanySettings = require('../models/CompanySettings');
const mongoose = require('mongoose');

// Helper to determine if transaction is Intra-state (CGST+SGST) or Inter-state (IGST)
const getTaxSplits = (taxRate, taxAmount, storeState, destinationState) => {
  const cleanStoreState = (storeState || '').trim().toLowerCase();
  const cleanDestState = (destinationState || '').trim().toLowerCase();
  
  // If destination state is not specified, default to Intra-state
  const isIntraState = !cleanDestState || cleanStoreState === cleanDestState;
  
  if (isIntraState) {
    return {
      cgstRate: taxRate / 2,
      cgstAmount: taxAmount / 2,
      sgstRate: taxRate / 2,
      sgstAmount: taxAmount / 2,
      igstRate: 0,
      igstAmount: 0,
      type: 'Intra-State'
    };
  } else {
    return {
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: taxRate,
      igstAmount: taxAmount,
      type: 'Inter-State'
    };
  }
};

module.exports = {
  // GSTR-1 Sales Report
  getGSTR1: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const match = { orderStatus: 'Completed' };
      
      if (startDate || endDate) {
        match.saleDate = {};
        if (startDate) match.saleDate.$gte = new Date(startDate);
        if (endDate) match.saleDate.$lte = new Date(endDate);
      }

      const sales = await Sale.find(match).populate('items.product').sort({ saleDate: -1 });
      const settings = await CompanySettings.findOne();
      const storeState = settings?.orgState || '';

      const b2b = [];
      const b2c = [];
      const hsnSummaryMap = {};
      let minDoc = '';
      let maxDoc = '';
      let docCount = sales.length;
      let cancelledDocCount = 0;

      sales.forEach((sale) => {
        // Doc summary
        if (!minDoc || sale.saleNumber < minDoc) minDoc = sale.saleNumber;
        if (!maxDoc || sale.saleNumber > maxDoc) maxDoc = sale.saleNumber;
        if (sale.orderStatus === 'Cancelled') cancelledDocCount++;

        // Split items
        sale.items.forEach((item) => {
          const qty = item.quantity || 0;
          const taxable = (item.unitPrice * qty) - (item.discount || 0);
          const taxAmt = item.taxAmount || 0;
          const taxRate = item.taxRate || 0;
          const hsn = item.hsn || item.product?.hsnCode || 'N/A';

          const splits = getTaxSplits(taxRate, taxAmt, storeState, sale.placeOfSupply);

          // Update HSN Summary
          const hsnKey = `${hsn}_${taxRate}`;
          if (!hsnSummaryMap[hsnKey]) {
            hsnSummaryMap[hsnKey] = {
              hsn,
              description: item.product?.name || 'N/A',
              taxRate,
              totalQty: 0,
              totalValue: 0,
              taxableValue: 0,
              cgst: 0,
              sgst: 0,
              igst: 0,
              totalTax: 0
            };
          }
          hsnSummaryMap[hsnKey].totalQty += qty;
          hsnSummaryMap[hsnKey].totalValue += (taxable + taxAmt);
          hsnSummaryMap[hsnKey].taxableValue += taxable;
          hsnSummaryMap[hsnKey].cgst += splits.cgstAmount;
          hsnSummaryMap[hsnKey].sgst += splits.sgstAmount;
          hsnSummaryMap[hsnKey].igst += splits.igstAmount;
          hsnSummaryMap[hsnKey].totalTax += taxAmt;
        });

        // B2B vs B2C
        const isB2B = !!(sale.gstNumber && sale.gstNumber.trim().length >= 15);
        const record = {
          invoiceNo: sale.saleNumber,
          invoiceDate: sale.saleDate,
          customerName: sale.customerName,
          gstin: sale.gstNumber || 'N/A',
          placeOfSupply: sale.placeOfSupply || storeState,
          taxableValue: sale.subtotal - sale.totalDiscount,
          taxAmount: sale.totalTax,
          invoiceValue: sale.grandTotal,
          status: sale.orderStatus
        };

        if (isB2B) {
          b2b.push(record);
        } else {
          b2c.push(record);
        }
      });

      res.status(200).json({
        success: true,
        data: {
          b2b,
          b2c,
          hsnSummary: Object.values(hsnSummaryMap),
          documentSummary: {
            from: minDoc || 'N/A',
            to: maxDoc || 'N/A',
            total: docCount,
            cancelled: cancelledDocCount
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GSTR-2B Purchase Report
  getGSTR2B: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const match = {};

      if (startDate || endDate) {
        match.purchaseDate = {};
        if (startDate) match.purchaseDate.$gte = new Date(startDate);
        if (endDate) match.purchaseDate.$lte = new Date(endDate);
      }

      const purchases = await Purchase.find(match).populate('vendor').populate('items.product').sort({ purchaseDate: -1 });
      const settings = await CompanySettings.findOne();
      const storeState = settings?.orgState || '';

      const itcRecords = purchases.map((purchase) => {
        const vendorGST = purchase.vendor?.gstNumber || 'N/A';
        const vendorName = purchase.vendor?.name || 'N/A';
        const splits = getTaxSplits(purchase.totalTax ? (purchase.totalTax / (purchase.subtotal || 1)) * 100 : 18, purchase.totalTax || 0, storeState, purchase.vendor?.state || storeState);

        return {
          purchaseNo: purchase.purchaseNumber,
          invoiceNo: purchase.invoiceNumber || purchase.purchaseNumber,
          invoiceDate: purchase.invoiceDate || purchase.purchaseDate,
          vendorName,
          gstin: vendorGST,
          placeOfSupply: purchase.vendor?.state || storeState,
          taxableValue: purchase.subtotal - purchase.totalDiscount,
          cgst: splits.cgstAmount,
          sgst: splits.sgstAmount,
          igst: splits.igstAmount,
          totalTax: purchase.totalTax || 0,
          grandTotal: purchase.grandTotal,
          status: purchase.status
        };
      });

      res.status(200).json({
        success: true,
        data: itcRecords
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GSTR-3B Summary Report
  getGSTR3B: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const salesMatch = { orderStatus: 'Completed' };
      const purchaseMatch = {};

      if (startDate || endDate) {
        const dateQuery = {};
        if (startDate) dateQuery.$gte = new Date(startDate);
        if (endDate) dateQuery.$lte = new Date(endDate);
        salesMatch.saleDate = dateQuery;
        purchaseMatch.purchaseDate = dateQuery;
      }

      const sales = await Sale.find(salesMatch);
      const purchases = await Purchase.find(purchaseMatch).populate('vendor');
      const settings = await CompanySettings.findOne();
      const storeState = settings?.orgState || '';

      // Compute sales tax (Outward Liability)
      let salesTaxable = 0;
      let salesCgst = 0;
      let salesSgst = 0;
      let salesIgst = 0;

      sales.forEach(sale => {
        salesTaxable += (sale.subtotal - sale.totalDiscount);
        sale.items.forEach(item => {
          const splits = getTaxSplits(item.taxRate || 0, item.taxAmount || 0, storeState, sale.placeOfSupply);
          salesCgst += splits.cgstAmount;
          salesSgst += splits.sgstAmount;
          salesIgst += splits.igstAmount;
        });
      });

      // Compute purchase tax (Inward ITC)
      let purchaseTaxable = 0;
      let purchaseCgst = 0;
      let purchaseSgst = 0;
      let purchaseIgst = 0;

      purchases.forEach(p => {
        purchaseTaxable += (p.subtotal - p.totalDiscount);
        const splits = getTaxSplits(p.totalTax ? (p.totalTax / (p.subtotal || 1)) * 100 : 18, p.totalTax || 0, storeState, p.vendor?.state || storeState);
        purchaseCgst += splits.cgstAmount;
        purchaseSgst += splits.sgstAmount;
        purchaseIgst += splits.igstAmount;
      });

      res.status(200).json({
        success: true,
        data: {
          outwardSupplies: {
            taxableValue: salesTaxable,
            cgst: salesCgst,
            sgst: salesSgst,
            igst: salesIgst,
            totalTax: salesCgst + salesSgst + salesIgst
          },
          eligibleITC: {
            taxableValue: purchaseTaxable,
            cgst: purchaseCgst,
            sgst: purchaseSgst,
            igst: purchaseIgst,
            totalTax: purchaseCgst + purchaseSgst + purchaseIgst
          },
          netLiability: {
            cgst: Math.max(0, salesCgst - purchaseCgst),
            sgst: Math.max(0, salesSgst - purchaseSgst),
            igst: Math.max(0, salesIgst - purchaseIgst),
            totalTax: Math.max(0, (salesCgst + salesSgst + salesIgst) - (purchaseCgst + purchaseSgst + purchaseIgst))
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

const express = require('express');
const router = express.Router();
const ColumnSetting = require('../models/ColumnSetting');

// Get column settings for a specific page
router.get('/:page', async (req, res) => {
  try {
    const { page } = req.params;
    let settings = await ColumnSetting.findOne({ page });
    if (!settings) {
      // Return default columns list
      const defaults = {
        invoice: [
          { id: 'item', name: 'Item', type: 'TEXT', visible: true, width: '250px' },
          { id: 'hsn', name: 'HSN/SAC', type: 'NUMBER', visible: true, width: '130px' },
          { id: 'gstRate', name: 'GST Rate', type: 'NUMBER', visible: true, width: '90px' },
          { id: 'quantity', name: 'Quantity', type: 'NUMBER', visible: true, width: '90px' },
          { id: 'rate', name: 'Rate', type: 'CURRENCY', visible: true, width: '110px' },
          { id: 'discount', name: 'Discount', type: 'CURRENCY', visible: true, width: '120px' },
          { id: 'amount', name: 'Amount', type: 'CURRENCY', visible: true, width: '110px', formula: 'Quantity * Rate' },
          { id: 'cgst', name: 'CGST', type: 'CURRENCY', visible: true, width: '90px' },
          { id: 'sgst', name: 'SGST', type: 'CURRENCY', visible: true, width: '90px' },
          { id: 'total', name: 'Total', type: 'CURRENCY', visible: true, width: '110px', formula: 'Amount + CGST + SGST' }
        ],
        quotation: [
          { id: 'item', name: 'Item', type: 'TEXT', visible: true, width: '250px' },
          { id: 'hsn', name: 'HSN/SAC', type: 'NUMBER', visible: true, width: '90px' },
          { id: 'gstRate', name: 'GST Rate', type: 'NUMBER', visible: true, width: '80px' },
          { id: 'quantity', name: 'Quantity', type: 'NUMBER', visible: true, width: '72px' },
          { id: 'rate', name: 'Rate', type: 'CURRENCY', visible: true, width: '80px' },
          { id: 'amount', name: 'Amount', type: 'CURRENCY', visible: true, width: '80px', formula: 'Quantity * Rate' },
          { id: 'cgst', name: 'CGST', type: 'CURRENCY', visible: true, width: '72px' },
          { id: 'sgst', name: 'SGST', type: 'CURRENCY', visible: true, width: '72px' },
          { id: 'total', name: 'Total', type: 'CURRENCY', visible: true, width: '80px', formula: 'Amount + CGST + SGST' }
        ]
      };
      
      const defaultCols = defaults[page] || defaults['invoice'];
      settings = new ColumnSetting({ page, columns: defaultCols });
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save or update column settings for a page
router.post('/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const { columns } = req.body;
    let settings = await ColumnSetting.findOne({ page });
    if (settings) {
      settings.columns = columns;
      await settings.save();
    } else {
      settings = new ColumnSetting({ page, columns });
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

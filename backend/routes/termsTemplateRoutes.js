const express = require('express');
const router = express.Router();
const TermsTemplate = require('../models/TermsTemplate');

// Get all terms templates (seed defaults if none exist)
router.get('/', async (req, res) => {
  try {
    let templates = await TermsTemplate.find();
    if (templates.length === 0) {
      const defaultTemplates = [
        {
          name: 'Brand New',
          terms: [
            'Warranty: 1-year manufacturer warranty from the date of invoice.',
            'Delivery: Dispatch will be done within 2-3 business days after order confirmation.',
            'Payment: 100% advance payment prior to dispatch.',
            'Validity: Prices are valid for 15 days.'
          ]
        },
        {
          name: 'Refurbished',
          terms: [
            'Warranty: 90-days seller warranty covering hardware parts.',
            'Delivery: Dispatch within 3-5 business days.',
            'Condition: Fully tested refurbished unit. Minor cosmetic blemishes may be present.',
            'Payment: 50% advance, 50% on delivery.'
          ]
        },
        {
          name: 'Rental',
          terms: [
            'Rental Period: Minimum contract duration is 3 months.',
            'Security Deposit: Refundable security deposit equivalent to 1 month rental value.',
            'Maintenance: Standard maintenance is covered by the provider.',
            'Payment: Monthly rental due by the 5th of each month.'
          ]
        }
      ];
      await TermsTemplate.insertMany(defaultTemplates);
      templates = await TermsTemplate.find();
    }
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update template
router.post('/', async (req, res) => {
  try {
    const { name, terms } = req.body;
    let template = await TermsTemplate.findOne({ name });
    if (template) {
      template.terms = terms;
      await template.save();
    } else {
      template = new TermsTemplate({ name, terms });
      await template.save();
    }
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete template
router.delete('/:id', async (req, res) => {
  try {
    await TermsTemplate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

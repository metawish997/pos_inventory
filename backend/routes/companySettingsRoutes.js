const express = require('express');
const router = express.Router();
const CompanySetting = require('../models/CompanySetting');

// Get all organizations (creates a default one if none exist)
router.get('/', async (req, res) => {
  try {
    let settings = await CompanySetting.find();
    if (settings.length === 0) {
      const defaultSetting = new CompanySetting();
      await defaultSetting.save();
      settings = [defaultSetting];
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new organization
router.post('/', async (req, res) => {
  try {
    const settings = new CompanySetting(req.body);
    await settings.save();
    res.status(201).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific organization by ID
router.get('/:id', async (req, res) => {
  try {
    const settings = await CompanySetting.findById(req.params.id);
    if (!settings) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific organization
router.put('/:id', async (req, res) => {
  try {
    const settings = await CompanySetting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!settings) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Legacy support: Update settings (fallback to first document if no ID specified)
router.put('/', async (req, res) => {
  try {
    let settings = await CompanySetting.findOne();
    if (!settings) {
      settings = new CompanySetting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a specific organization
router.delete('/:id', async (req, res) => {
  try {
    const settings = await CompanySetting.findByIdAndDelete(req.params.id);
    if (!settings) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

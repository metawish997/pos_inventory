const express = require('express');
const router = express.Router();
const CompanySetting = require('../models/CompanySetting');

// Get settings (creates one if not exists)
router.get('/', async (req, res) => {
  try {
    let settings = await CompanySetting.findOne();
    if (!settings) {
      settings = new CompanySetting();
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings
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

module.exports = router;

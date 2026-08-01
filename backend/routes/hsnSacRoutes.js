const express = require('express');
const router = express.Router();
const HsnSac = require('../models/HsnSac');

// Search HSN/SAC codes
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      // Return top 20 items initially if query is empty
      const items = await HsnSac.find().limit(30);
      return res.status(200).json(items);
    }
    
    // Perform search by regex on code or description
    const searchRegex = new RegExp(query, 'i');
    const items = await HsnSac.find({
      $or: [
        { code: searchRegex },
        { description: searchRegex }
      ]
    }).limit(30);
    
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

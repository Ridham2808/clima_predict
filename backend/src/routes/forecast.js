const express = require('express');
const router = express.Router();
const Forecast = require('../models/Forecast');

// GET /api/v1/forecast?lat={lat}&lon={lon}&village={village}
router.get('/', async (req, res) => {
  try {
    const { lat, lon, village } = req.query;

    if (!lat || !lon || !village) {
      return res.status(400).json({ error: 'Missing required parameters: lat, lon, village' });
    }

    // Find latest forecast for village
    const forecast = await Forecast.findOne({ village })
      .sort({ generated_at: -1 })
      .limit(1);

    if (!forecast) {
      return res.status(404).json({ error: 'Forecast not found' });
    }

    res.json(forecast);
  } catch (error) {
    console.error('Forecast fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


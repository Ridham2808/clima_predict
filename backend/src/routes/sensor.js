const express = require('express');
const router = express.Router();
const SensorReading = require('../models/SensorReading');

// POST /api/v1/sensor
router.post('/', async (req, res) => {
  try {
    const { sensor_id, village, timestamp, type, value, units, battery } = req.body;

    if (!sensor_id || !village || !timestamp || !type || value === undefined || !units) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const reading = new SensorReading({
      sensor_id,
      village,
      timestamp: new Date(timestamp),
      type,
      value,
      units,
      battery: battery || 0,
    });

    await reading.save();

    res.json({ status: 'ok', message: 'Sensor reading stored' });
  } catch (error) {
    console.error('Sensor reading save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


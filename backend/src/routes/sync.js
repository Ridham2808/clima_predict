const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const SensorReading = require('../models/SensorReading');

// POST /api/v1/sync
router.post('/', async (req, res) => {
  try {
    // Parse NDJSON or JSON array
    let events = [];
    if (typeof req.body === 'string') {
      // NDJSON format
      events = req.body.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
    } else if (Array.isArray(req.body)) {
      events = req.body;
    } else {
      return res.status(400).json({ error: 'Invalid payload format' });
    }

    let syncedCount = 0;

    // Process each event
    for (const event of events) {
      try {
        if (event.type === 'sensor' || event.sensor_id) {
          const reading = new SensorReading(event);
          await reading.save();
          syncedCount++;
        } else if (event.type === 'feedback' || event.rating) {
          const feedback = new Feedback(event);
          await feedback.save();
          syncedCount++;
        }
      } catch (err) {
        console.error('Event processing error:', err);
      }
    }

    // Return resources to download (model updates, forecast updates)
    const resources = []; // In production, check for updates

    res.json({
      resources,
      synced_count: syncedCount,
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


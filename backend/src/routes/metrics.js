const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const SensorReading = require('../models/SensorReading');
const Forecast = require('../models/Forecast');
const mongoose = require('mongoose');

// GET /api/v1/metrics (Admin only - add auth middleware)
router.get('/', async (req, res) => {
  try {
    // Total users (from feedbacks)
    const totalUsers = await Feedback.distinct('user_id').countDocuments();

    // Sync success rate (simplified - count successful syncs vs total)
    const totalSyncs = await SensorReading.countDocuments();
    const successfulSyncs = totalSyncs; // In production, track sync status
    const syncSuccessRate = totalSyncs > 0 ? successfulSyncs / totalSyncs : 0;

    // Forecast accuracy (average rating)
    const feedbacks = await Feedback.find({ rating: { $exists: true } });
    const avgRating = feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0;
    const forecastAccuracy = (avgRating / 5) * 100; // Convert to percentage

    // Model downloads (simplified - track via logs or separate collection)
    const modelDownloads = 0; // In production, track separately

    res.json({
      total_users: totalUsers,
      sync_success_rate: syncSuccessRate,
      forecast_accuracy: forecastAccuracy,
      model_downloads: modelDownloads,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Metrics fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const Forecast = require('../models/Forecast');
const InsuranceClaim = require('../models/InsuranceClaim');
const { v4: uuidv4 } = require('uuid');

// POST /api/v1/claim_estimate
router.post('/', async (req, res) => {
  try {
    const { village, crop, forecast_window, area_hectares } = req.body;

    if (!village || !crop || !forecast_window || !area_hectares) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get latest forecast
    const forecast = await Forecast.findOne({ village })
      .sort({ generated_at: -1 })
      .limit(1);

    if (!forecast) {
      return res.status(404).json({ error: 'No forecast available for village' });
    }

    // Calculate average risk score
    const dailyForecasts = forecast.daily_forecasts.slice(0, forecast_window);
    const avgRisk = dailyForecasts.reduce((sum, day) => sum + (day.risk_score || 0), 0) / dailyForecasts.length;

    // Estimate loss (simplified - in production, use actual crop prices)
    const cropPricePerHectare = {
      wheat: 50000,
      rice: 55000,
    }[crop.toLowerCase()] || 50000;

    const estimatedLossValue = avgRisk * cropPricePerHectare * area_hectares;
    const recommendedAction = avgRisk > 0.5 ? 'file_pm-fby_claim' : avgRisk > 0.3 ? 'monitor' : 'no_action';

    const claimEstimate = new InsuranceClaim({
      record_id: uuidv4(),
      village,
      crop,
      forecasted_loss_probability: avgRisk,
      estimated_loss_value: estimatedLossValue,
      recommended_action: recommendedAction,
      timestamp: new Date(),
    });

    await claimEstimate.save();

    res.json(claimEstimate);
  } catch (error) {
    console.error('Claim estimate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


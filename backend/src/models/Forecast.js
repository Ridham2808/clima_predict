const mongoose = require('mongoose');

const DailyForecastSchema = new mongoose.Schema({
  date: { type: String, required: true },
  temp_min: { type: Number, required: true },
  temp_max: { type: Number, required: true },
  precip_prob: { type: Number, required: true, min: 0, max: 1 },
  wind_kmh: { type: Number, required: true },
  humidity: { type: Number, required: true, min: 0, max: 100 },
  risk_score: { type: Number, required: true, min: 0, max: 1 },
  explanations: { type: String, default: '' },
});

const ForecastSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  village: { type: String, required: true, index: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  source: { type: String, enum: ['ondevice', 'cloud'], required: true },
  generated_at: { type: Date, required: true, index: true },
  valid_from: { type: Date, required: true },
  valid_until: { type: Date, required: true },
  daily_forecasts: [DailyForecastSchema],
  model_version: { type: String, required: true },
  signature: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Forecast', ForecastSchema);


const mongoose = require('mongoose');

const SensorReadingSchema = new mongoose.Schema({
  sensor_id: { type: String, required: true, index: true },
  village: { type: String, required: true, index: true },
  timestamp: { type: Date, required: true, index: true },
  type: { type: String, enum: ['temp', 'humidity', 'soil_moisture'], required: true },
  value: { type: Number, required: true },
  units: { type: String, enum: ['C', '%', 'm3'], required: true },
  battery: { type: Number, min: 0, max: 100, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SensorReading', SensorReadingSchema);


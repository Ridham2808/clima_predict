const mongoose = require('mongoose');

const InsuranceClaimSchema = new mongoose.Schema({
  record_id: { type: String, required: true, unique: true },
  village: { type: String, required: true, index: true },
  crop: { type: String, required: true },
  forecasted_loss_probability: { type: Number, required: true, min: 0, max: 1 },
  estimated_loss_value: { type: Number, required: true },
  recommended_action: { type: String, enum: ['file_pm-fby_claim', 'monitor', 'no_action'], required: true },
  timestamp: { type: Date, required: true, index: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('InsuranceClaim', InsuranceClaimSchema);


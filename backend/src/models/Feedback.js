const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  village: { type: String, required: true, index: true },
  user_id: { type: String, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  timestamp: { type: Date, required: true, index: true },
  attached_photo: { type: String },
  signed_claim: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Feedback', FeedbackSchema);


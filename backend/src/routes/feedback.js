const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/v1/feedback
router.post('/', async (req, res) => {
  try {
    const { id, village, user_id, rating, comment, timestamp } = req.body;

    if (!id || !village || !user_id || !rating || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const feedback = new Feedback({
      id,
      village,
      user_id,
      rating,
      comment,
      timestamp: new Date(timestamp),
    });

    await feedback.save();

    res.json({
      status: 'ok',
      message: 'Thanks for your feedback!',
    });
  } catch (error) {
    console.error('Feedback save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


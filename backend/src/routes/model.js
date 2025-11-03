const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

// GET /api/v1/model/latest
router.get('/latest', async (req, res) => {
  try {
    // In production, fetch from database or config
    const modelVersion = process.env.MODEL_VERSION || 'v1.0.0';
    const modelBucket = process.env.MODEL_BUCKET || 'climapredict-models';
    const modelKey = `models/${modelVersion}.tflite`;

    // Generate signed URL (valid for 1 hour)
    const url = s3.getSignedUrl('getObject', {
      Bucket: modelBucket,
      Key: modelKey,
      Expires: 3600,
    });

    res.json({
      model_version: modelVersion,
      url,
      size_bytes: 52000000, // In production, fetch from S3 metadata
      sha256: process.env.MODEL_SHA256 || 'a1b2c3d4...',
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Model fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


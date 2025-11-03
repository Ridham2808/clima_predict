# ClimaPredict Model Training

This directory contains scripts for training and evaluating the ClimaPredict TensorFlow Lite model.

## Setup

```bash
pip install -r requirements.txt
```

## Training

```bash
python train_model.py \
  --data-path data/training_data.csv \
  --epochs 100 \
  --batch-size 32 \
  --output-path models/climapredict_v1.tflite
```

## Evaluation

```bash
python evaluate_model.py \
  --model models/climapredict_v1.tflite \
  --test-data data/test_set.csv \
  --baseline data/baseline_predictions.csv
```

## Data Format

Training data should include:
- Satellite time-series (8 days × 16 features)
- Sensor time-series (8 days × 3 features)
- Static features (6: lat, lon, elevation, soil, crop, irrigation)
- Forecast targets (7 days × 5 vars)
- Risk targets (7 days)

## Model Architecture

- Encoder-Fusion-Decoder architecture
- LSTM encoders for time-series
- Dense layers for static features
- Dynamic range quantization for TFLite export
- Target size: ≤50MB

## Notes

- For production, use real NASA MODIS + OpenWeather data
- This demo uses synthetic data
- Adjust hyperparameters based on your dataset


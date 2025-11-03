# Pilot Simulation Scripts (Anand, Gujarat)

Scripts for downloading data, preprocessing, and running pilot simulations.

## Setup

```bash
pip install -r requirements.txt
```

## Data Collection

```bash
# Download NASA MODIS data
python download_modis_data.py --region gujarat --start 2023-01-01 --end 2023-12-31

# Download OpenWeather historical data
python download_openweather.py --lat 23.0 --lon 72.6 --start 2023-01-01

# Preprocess
python preprocess_data.py
```

## Evaluation

```bash
# Evaluate baseline
python evaluate_baseline.py --baseline openweather --ground-truth imd_data.csv

# Evaluate model
python evaluate_model.py --model ../models/climapredict_v1.tflite --test-data test_set.csv
```

## Simulation

```bash
# Test offline resilience
python test_offline.py --cache-days 7

# Simulate crop loss reduction
python simulate_crop_loss.py --scenario drought --crop wheat
```

## Notes

- Replace with actual API keys for MODIS/OpenWeather
- IMD data may require manual collection
- Adjust dates based on available data


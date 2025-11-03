# ClimaPredict Testing Plan

## Overview

This document outlines the testing strategy for ClimaPredict, including unit tests, integration tests, and pilot simulation procedures for the Anand, Gujarat pilot.

## Test Categories

### 1. Unit Tests

**Location**: `test/unit/`

**Coverage Targets:**
- Services: 80%+
- Models: 90%+
- Utils: 85%+

**Test Files:**
- `test/unit/services/ml_service_test.dart`
- `test/unit/services/database_service_test.dart`
- `test/unit/services/api_service_test.dart`
- `test/unit/services/sync_service_test.dart`
- `test/unit/models/forecast_cache_test.dart`

**Run:**
```bash
flutter test test/unit/
```

### 2. Widget Tests

**Location**: `test/widget/`

**Coverage:**
- All screens
- Custom widgets
- Navigation flows

**Test Files:**
- `test/widget/screens/welcome_screen_test.dart`
- `test/widget/screens/home_screen_test.dart`
- `test/widget/widgets/forecast_card_test.dart`

**Run:**
```bash
flutter test test/widget/
```

### 3. Integration Tests

**Location**: `integration_test/`

**Scenarios:**
1. **Onboarding Flow**
   - Welcome → Profile Setup → Permissions → Home
   - Verify data persistence

2. **Offline Functionality**
   - Disable internet
   - Verify cached forecast display
   - Verify "Using cached data" banner

3. **Forecast Generation**
   - Verify on-device forecast generation
   - Check forecast cache persistence
   - Validate 7-day forecast structure

4. **Bluetooth Sensor**
   - Scan for devices
   - Pair sensor
   - Verify data collection

5. **Sync Mechanism**
   - Trigger manual sync
   - Verify data upload
   - Verify forecast updates

**Run:**
```bash
flutter test integration_test/
flutter drive --target=integration_test/app_test.dart
```

### 4. Pilot Simulation (Anand, Gujarat)

**Objective**: Validate forecast accuracy improvements and offline resilience.

#### 4.1 Data Collection

**Location**: `scripts/pilot/`

**Scripts:**
- `download_modis_data.py` - Download NASA MODIS historical data
- `download_openweather.py` - Download OpenWeather historical data
- `download_imd_data.py` - Download IMD ground truth (if available)
- `preprocess_data.py` - Preprocess and align datasets

**Run:**
```bash
cd scripts/pilot
python download_modis_data.py --region gujarat --start 2023-01-01 --end 2023-12-31
python download_openweather.py --lat 23.0 --lon 72.6 --start 2023-01-01
python preprocess_data.py
```

#### 4.2 Baseline Evaluation

**Script**: `scripts/pilot/evaluate_baseline.py`

**Metrics:**
- MAPE (Mean Absolute Percentage Error)
- RMSE (Root Mean Square Error)
- Correlation coefficient

**Run:**
```bash
python scripts/pilot/evaluate_baseline.py --baseline openweather --ground-truth imd_data.csv
```

**Expected Output:**
```
Baseline (OpenWeather) Metrics:
- MAPE: 15.3%
- RMSE: 2.8°C
- Correlation: 0.72
```

#### 4.3 Model Evaluation

**Script**: `scripts/pilot/evaluate_model.py`

**Process:**
1. Load trained TFLite model
2. Run inference on test set
3. Compare with baseline
4. Calculate improvement percentage

**Run:**
```bash
python scripts/pilot/evaluate_model.py \
  --model models/climapredict_v1.tflite \
  --test-data test_set.csv \
  --baseline baseline_predictions.csv
```

**Expected Output:**
```
Model Metrics:
- MAPE: 12.2% (20.1% improvement)
- RMSE: 2.2°C (21.4% improvement)
- Correlation: 0.81

Target: ≥20% improvement ✅
```

#### 4.4 Offline Resilience Test

**Script**: `scripts/pilot/test_offline.py`

**Procedure:**
1. Generate forecast cache
2. Disconnect network
3. Verify app functions offline
4. Test 7-day cache availability

**Run:**
```bash
python scripts/pilot/test_offline.py --cache-days 7
```

#### 4.5 User Acceptance Testing

**Participants**: 5 farmers from Anand, Gujarat

**Test Protocol**:
1. Install APK on low-end Android device (<$100)
2. Complete onboarding
3. Use app for 1 week
4. Provide feedback via rating system

**Metrics**:
- Voice usability: ≥80% positive (4/5 farmers)
- Ease of use: ≥80% positive
- Forecast accuracy perception: ≥70% positive

**Feedback Form** (Hindi/English):
```
1. Was the voice help useful? (1-5 stars)
2. Was the forecast easy to understand? (1-5 stars)
3. Did the recommendations help? (Yes/No)
4. Would you recommend to others? (Yes/No)
5. Any suggestions?
```

#### 4.6 Crop Loss Reduction Simulation

**Script**: `scripts/pilot/simulate_crop_loss.py`

**Scenario**: Unexpected drought/flood event

**Procedure:**
1. Simulate extreme weather event
2. Compare farmer decisions:
   - With ClimaPredict (follows recommendations)
   - Without ClimaPredict (baseline behavior)
3. Calculate loss reduction percentage

**Run:**
```bash
python scripts/pilot/simulate_crop_loss.py \
  --scenario drought \
  --crop wheat \
  --area 2.5 \
  --baseline-loss 50000
```

**Expected Output:**
```
Simulation Results:
- Baseline Loss: ₹50,000
- With ClimaPredict: ₹30,000
- Loss Reduction: 40% ✅

Target: ≥40% reduction ✅
```

## Performance Tests

### Mobile App

**Targets:**
- APK size: <50MB
- Model inference: ≤600ms
- Memory usage: ≤120MB peak
- App launch: ≤2 seconds

**Tools:**
- Flutter DevTools
- Android Profiler

### Backend API

**Targets:**
- Response time (p95): <500ms
- Throughput: 1000 req/sec
- Uptime: 99.9%

**Tools:**
- Apache Bench (ab)
- k6
- Postman Collections

## Test Data

**Location**: `test_data/`

- `anand_sample_forecasts.json` - Sample forecast data
- `sensor_readings.csv` - Synthetic sensor data
- `farmer_profiles.json` - Test user profiles

## Continuous Testing

**GitHub Actions**: `.github/workflows/test.yml`

Runs on every PR:
1. Unit tests
2. Widget tests
3. Integration tests (smoke)
4. Linting
5. Code coverage

## Test Reports

**Coverage Reports**: `coverage/`

Generated via:
```bash
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
```

## Pilot Results Template

After pilot completion, create `docs/pilot_results.md` with:

1. **Forecast Accuracy**
   - Baseline metrics
   - Model metrics
   - Improvement percentage

2. **Offline Resilience**
   - Cache availability
   - Functionality offline

3. **User Feedback**
   - Ratings summary
   - Common feedback themes

4. **Crop Loss Simulation**
   - Baseline vs ClimaPredict comparison
   - Reduction percentage

5. **Issues Found**
   - Bugs discovered
   - Performance issues
   - UX improvements needed

## Running All Tests

```bash
# Unit + Widget tests
flutter test

# Integration tests
flutter test integration_test/

# Pilot simulation
cd scripts/pilot
python run_full_pilot.py
```

---

*Last Updated: 2024*


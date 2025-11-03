# ClimaPredict: AI for Rural Resilience

Hyper-local climate guidance for small farmers - An Android-first Flutter app that provides village-level climate forecasts and actionable recommendations offline.

## Overview

ClimaPredict is an AI-powered mobile application designed for small-scale farmers in rural areas. It delivers hyper-local climate forecasts at the village/block level, works entirely offline, and provides voice-first interactions in Hindi and English.

### Key Features

- ✅ **Offline-First**: Works completely offline with cached forecasts
- ✅ **On-Device AI**: TensorFlow Lite model (≤50MB) for 7-day hyper-local forecasts
- ✅ **Multi-Source Data Fusion**: Combines NASA MODIS satellite data, OpenWeather baseline, Bluetooth sensors, and farmer feedback
- ✅ **Voice Support**: Hindi and English TTS for voice explanations
- ✅ **Bluetooth Sensor Integration**: Connect low-cost Arduino-based sensors
- ✅ **Insurance Predictor**: Estimate crop loss and generate PMFBY claim evidence
- ✅ **Personalized Recommendations**: AI-driven farming tips based on forecast and crop profile

## Tech Stack

### Frontend (Flutter)
- **Framework**: Flutter 3.7+
- **State Management**: Provider
- **Local Database**: Hive (lightweight, fast)
- **ML**: TensorFlow Lite Flutter
- **BLE**: flutter_reactive_ble
- **Background Sync**: WorkManager
- **Voice**: flutter_tts, speech_to_text

### Backend (Node.js)
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MongoDB Atlas (or Firebase Realtime DB)
- **Storage**: AWS S3 for model artifacts

## Project Structure

```
lib/
├── models/              # Data models (Hive adapters)
│   ├── farmer_profile.dart
│   ├── forecast_cache.dart
│   ├── sensor_reading.dart
│   ├── feedback.dart
│   └── insurance_claim.dart
├── services/           # Core services
│   ├── database_service.dart
│   ├── api_service.dart
│   ├── ml_service.dart
│   ├── sensor_service.dart
│   └── sync_service.dart
├── screens/           # UI screens
│   ├── onboarding/
│   ├── main/
│   ├── forecast/
│   ├── recommendations/
│   ├── settings/
│   └── insurance/
├── widgets/           # Reusable widgets
└── utils/            # Utility functions
```

## Setup & Installation

### Prerequisites

- Flutter SDK (>=3.7.0)
- Android SDK (API 26+)
- Node.js 16+ (for backend)
- MongoDB or Firebase account

### Flutter App Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/climapredict.git
cd climapredict
```

2. **Install dependencies**
```bash
flutter pub get
```

3. **Generate Hive adapters** (required for data models)
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

4. **Run the app**
```bash
flutter run
```

### Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your MongoDB/Firebase credentials
```

3. **Start the server**
```bash
npm start
```

## Build Release APK

```bash
flutter build apk --release --split-per-abi
```

The APK will be generated at:
- `build/app/outputs/flutter-apk/app-release.apk`

## Configuration

### Android

- **Min SDK**: 26 (Android 8.0)
- **Target SDK**: Latest
- **Core Library Desugaring**: Enabled (for Java 8+ support)
- **ProGuard Rules**: Configured for TensorFlow Lite and Google Play Core

### Permissions

The app requires:
- Location (for village-level forecasts)
- Bluetooth (for sensor connection)
- Notifications (for alerts)

## Data Models

### FarmerProfile
```dart
{
  "id": "uuid",
  "name": "string",
  "village": "string",
  "crops": ["wheat", "rice"],
  "language": "en|hi",
  ...
}
```

### ForecastCache
```dart
{
  "id": "uuid",
  "village": "string",
  "daily_forecasts": [
    {
      "date": "YYYY-MM-DD",
      "temp_min": 20.0,
      "temp_max": 28.0,
      "precip_prob": 0.3,
      "risk_score": 0.12,
      ...
    }
  ],
  ...
}
```

## API Endpoints

### GET /api/v1/forecast
Fetch forecast for a village location.

**Query Parameters:**
- `lat`: Latitude
- `lon`: Longitude
- `village`: Village name

### POST /api/v1/feedback
Submit farmer feedback/rating.

### POST /api/v1/sensor
Submit sensor reading data.

### POST /api/v1/claim_estimate
Get insurance claim estimate.

See `API_SPEC.yaml` for complete OpenAPI specification.

## ML Model

The app uses a TensorFlow Lite model for on-device inference:
- **Input**: Satellite time-series (8 days × 16 features), sensor data (8 days × 3 features), static features (6)
- **Output**: 7-day forecast (temp, precipitation, wind, humidity) + risk scores
- **Size**: ≤50MB (quantized int8)
- **Location**: `assets/models/climapredict_v1.tflite`

### Model Training

Training pipeline (cloud):
1. Collect historical NASA MODIS data
2. Combine with OpenWeather baseline
3. Train encoder-fusion-decoder architecture
4. Quantize to TFLite
5. Deploy via `/api/v1/model/latest`

See `models/training/` for training scripts.

## Offline Behavior

The app is designed to work completely offline:

1. **Forecast Cache**: Last 7 days cached locally
2. **Model**: Stored on device
3. **Sensor Data**: Buffered locally, synced when online
4. **Offline Banner**: Shows "Using cached data" when offline

## Sync Mechanism

- **Automatic**: Background sync every 15 minutes (when on Wi-Fi, battery >20%)
- **Manual**: "Sync Now" button in Settings
- **Delta Sync**: Only uploads new sensor readings and feedback
- **Conflict Resolution**: Server timestamp wins for forecasts

## Testing

### Unit Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter test integration_test/
```

### Pilot Simulation
See `docs/testing_plan.md` for pilot simulation scripts (Anand, Gujarat).

## Contributing

See `CONTRIBUTING.md` for guidelines.

## License

Apache-2.0 License - See `LICENSE` file.

## Demo & Presentation

- **Demo Video**: `demo/demo.mp4` (2-minute walkthrough)
- **Pitch Deck**: `pitch/pitch_deck.pdf` (5 slides)
- **Prototype**: `prototype/ClimaPredict-prototype.pptx`

## Tagline

**"ClimaPredict: From Sky to Soil — AI That Saves Crops, Lives, and the Planet."**

## Support

For issues and questions:
- GitHub Issues: [https://github.com/yourusername/climapredict/issues](https://github.com/yourusername/climapredict/issues)
- Email: support@climapredict.org

---

Built with ❤️ for rural farmers worldwide.

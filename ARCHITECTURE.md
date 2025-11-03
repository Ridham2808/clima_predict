# ClimaPredict Architecture

## System Overview

ClimaPredict is a mobile-first, offline-capable climate forecasting system for rural farmers. The architecture follows a **local-first** design pattern, ensuring the app works entirely offline while syncing data when connectivity is available.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Mobile App (Flutter)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   UI Layer   │  │ Service Layer│  │  Data Layer  │          │
│  │              │  │              │  │              │          │
│  │ - Screens    │  │ - ML Service │  │ - Hive DB     │          │
│  │ - Widgets    │  │ - API Client │  │ - Cache       │          │
│  │ - Navigation │  │ - Sync       │  │ - Models      │          │
│  │              │  │ - Sensors    │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              TensorFlow Lite Model (≤50MB)                  │  │
│  │  Input: Satellite + Sensor + Static Features               │  │
│  │  Output: 7-day Forecast + Risk Scores                      │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Sync when online)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API (Node.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Express API │  │   MongoDB    │  │   AWS S3     │          │
│  │              │  │              │  │              │          │
│  │ - REST       │  │ - User Data  │  │ - Model      │          │
│  │ - Auth       │  │ - Forecasts  │  │   Artifacts  │          │
│  │ - Sync       │  │ - Feedback   │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Data Sources)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Data Sources                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ NASA MODIS   │  │  OpenWeather │  │   Sensors     │          │
│  │ Satellite    │  │  Baseline    │  │  (BLE)        │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Mobile App (Flutter)

#### UI Layer
- **Onboarding Flow**: Welcome → Profile Setup → Permissions → Home
- **Home Dashboard**: Today's forecast, accuracy meter, offline banner
- **Forecasts Screen**: 7-day detailed forecast with risk indicators
- **Recommendations Screen**: AI-driven farming tips
- **Insurance Predictor**: Loss estimation and claim generation
- **Settings Screen**: Offline mode, language, notifications

#### Service Layer

**MLService**
- Loads TensorFlow Lite model from assets
- Runs inference on-device
- Generates 7-day forecasts with risk scores
- Fallback mechanism if model unavailable

**DatabaseService**
- Hive-based local storage
- CRUD operations for all models
- Cache management (7 days forecasts, 30 days sensor data)

**ApiService**
- REST API client
- Endpoint: GET /forecast, POST /feedback, POST /sensor, etc.
- Handles offline/online state

**SensorService**
- Bluetooth Low Energy (BLE) scanning
- Sensor pairing and data collection
- Parses sensor readings (temp, humidity, soil moisture)

**SyncService**
- Background sync via WorkManager
- Delta sync (only new data)
- Conflict resolution
- Model update checks

#### Data Layer

**Models** (Hive-annotated)
- `FarmerProfile`: User information
- `ForecastCache`: Cached forecasts
- `SensorReading`: BLE sensor data
- `Feedback`: User ratings/comments
- `InsuranceClaimEstimate`: Claim predictions

### 2. Backend API (Node.js/Express)

#### API Endpoints

```
GET  /api/v1/forecast          - Get forecast for village
POST /api/v1/feedback          - Submit feedback
POST /api/v1/sensor            - Submit sensor reading
GET  /api/v1/model/latest      - Get latest model info
POST /api/v1/sync              - Batch sync (NDJSON)
POST /api/v1/claim_estimate    - Get insurance estimate
GET  /api/v1/metrics           - Admin metrics
```

#### Database Schema (MongoDB)

**farmers**
```javascript
{
  _id: ObjectId,
  id: String (UUID),
  name: String,
  village: String,
  crops: [String],
  language: String,
  created_at: Date,
  last_sync_at: Date
}
```

**forecasts**
```javascript
{
  _id: ObjectId,
  id: String,
  village: String,
  lat: Number,
  lon: Number,
  daily_forecasts: [Object],
  model_version: String,
  generated_at: Date,
  valid_until: Date
}
```

**sensor_readings**
```javascript
{
  _id: ObjectId,
  sensor_id: String,
  village: String,
  timestamp: Date,
  type: String,
  value: Number,
  units: String
}
```

**feedback**
```javascript
{
  _id: ObjectId,
  id: String,
  village: String,
  user_id: String,
  rating: Number,
  comment: String,
  timestamp: Date
}
```

### 3. ML Pipeline

#### Model Architecture

**Inputs:**
- Satellite sequence: `[8 days × 16 features]`
- Sensor sequence: `[8 days × 3 features]`
- Static features: `[6]` (lat, lon, elevation, soil, crop, irrigation)

**Architecture:**
- Encoder-Fusion-Decoder
- Lightweight attention mechanism
- 1D residual Conv blocks

**Outputs:**
- Forecast sequence: `[7 days × 5 vars]` (temp_min, temp_max, precip_prob, wind_kmh, humidity)
- Risk sequence: `[7 days × 1]` (0.0-1.0)

**Quantization:**
- Float32 → Int8 (post-training quantization)
- Target: ≤50MB TFLite binary

#### Training Pipeline

1. **Data Collection**
   - NASA MODIS historical data (preprocessed to daily aggregates)
   - OpenWeather historical baseline
   - IMD ground truth (for validation)
   - Synthetic sensor data

2. **Preprocessing**
   - Normalize features
   - Handle missing values
   - Create time-series windows

3. **Training**
   - TensorFlow 2.x
   - Loss: Combined MSE (forecast) + Binary Cross-Entropy (risk)
   - Optimizer: Adam
   - Early stopping

4. **Quantization**
   - Dynamic range quantization
   - Export to TFLite

5. **Evaluation**
   - Compare vs baseline (OpenWeather regional model)
   - Target: ≥20% improvement in MAPE/RMSE

### 4. Data Flow

#### Forecast Generation Flow

```
1. User opens app → Check cached forecast
2. If cache expired/missing:
   a. Load TF Lite model
   b. Prepare inputs (satellite, sensor, static)
   c. Run inference
   d. Generate ForecastCache
   e. Save to Hive
3. If online:
   a. Try API fetch
   b. Merge with local if newer
4. Display forecast
```

#### Sync Flow

```
1. Background task triggered (Wi-Fi + battery >20%)
2. Collect pending events:
   - Sensor readings (last 30 days)
   - Feedback (unsynced)
3. Compress to NDJSON
4. POST /api/v1/sync
5. Server responds with:
   - Updated forecasts (if any)
   - Model updates (if available)
6. Download and cache updates
```

### 5. Offline Strategy

**Cache Policy:**
- Forecasts: Last 7 days
- Sensor data: Last 30 days
- Model: Latest version (downloaded when on Wi-Fi)

**Graceful Degradation:**
- If model missing → Fallback prediction (location-based)
- If no cache → Show "No data" with sync prompt
- If offline → Show "Using cached data" banner

### 6. Security & Privacy

**Client:**
- PII encrypted at rest (AES-256)
- HTTPS/TLS 1.2+ for all API calls
- Consent flow on first launch
- Minimal PII collection

**Server:**
- JWT authentication
- Rate limiting
- Input validation
- Model signature verification (SHA256)

### 7. Performance Targets

**Mobile App:**
- APK size: <50MB (base)
- Model size: ≤50MB
- Inference latency: ≤600ms
- Memory: ≤120MB peak

**Backend:**
- API latency: <500ms (p95)
- Sync throughput: 1000 events/sec
- Uptime: 99.9%

## Deployment Architecture

### Mobile
- **Build**: Flutter APK/AAB
- **Distribution**: Play Store, direct APK
- **Update**: Model updates via API (not app updates)

### Backend
- **Runtime**: Node.js on Docker
- **Hosting**: AWS/GCP/Azure (free tier for demo)
- **Database**: MongoDB Atlas (free tier)
- **Storage**: AWS S3 (model artifacts)

### CI/CD
- **GitHub Actions**: Build APK on release
- **Docker Hub**: Auto-build backend image
- **Testing**: Automated tests before deploy

## Scalability Considerations

**Current (MVP):**
- Single region (India - Gujarat)
- 1-10K users
- Single MongoDB instance

**Future:**
- Multi-region support
- CDN for model distribution
- Redis cache layer
- Horizontal scaling (Kubernetes)

## Technology Stack Summary

**Frontend:**
- Flutter 3.7+
- Hive (local DB)
- TensorFlow Lite
- Provider (state)

**Backend:**
- Node.js 16+
- Express.js
- MongoDB
- AWS S3

**DevOps:**
- Docker
- GitHub Actions
- Docker Compose

**ML:**
- TensorFlow 2.x
- TFLite
- Python (training)

---

*Last Updated: 2024*

# ClimaPredict - Quick Start Guide

## 🚀 Running the App

### Prerequisites
- Flutter SDK installed
- Windows/Android/iOS development environment set up

### Run Commands

**For Windows:**
```bash
flutter run -d windows
```

**For Android:**
```bash
flutter run -d android
```

**For iOS:**
```bash
flutter run -d ios
```

**For Web:**
```bash
flutter run -d chrome
```

## 📱 App Navigation

The app has **5 main sections** accessible via the bottom navigation bar:

### 1. 🏠 Home
- Current weather with large temperature display
- Quick action buttons (Weather Map, Sensors, Alerts, Backend Test)
- Active weather alerts
- Air quality index

### 2. 🌤️ Forecast
- 7-day weather forecast
- Tap any day to see detailed information
- Access 24-hour forecast from top-right icon

### 3. 👥 Community
- Farmer posts and discussions
- Like, comment, and share functionality
- Create your own posts

### 4. 📊 Insights
- Weather statistics
- Farming recommendations
- Crop health monitoring
- Market prices
- Achievements

### 5. 👤 Profile
- User information
- Insurance details
- News & updates
- Weather tips
- Settings

## 🎯 Key Features to Explore

### Backend Connectivity Test
1. Go to **Home** screen
2. Tap **Backend Test** quick action
3. Press **Run Tests** button
4. See real-time API connectivity status

**Note:** Tests will fail since no backend is running - this is expected! The app works entirely with static data.

### Weather Alerts
1. Tap the notification icon on Home screen
2. View all active alerts with severity levels
3. See detailed information for each alert

### Crop Health Monitor
1. Go to **Insights** tab
2. Tap **Crop Health Monitor**
3. View health scores for all crops
4. See issues and recommendations

### Market Prices
1. Go to **Insights** tab
2. Tap **Market Prices**
3. View live prices with trend indicators

### Insurance
1. Go to **Profile** tab
2. Tap **Insurance**
3. View policy details and claims history

## 🎨 UI Highlights

- **CRED-Inspired Design** - Dark theme with vibrant colors
- **Gradient Cards** - Beautiful visual effects
- **Smooth Animations** - Polished interactions
- **Color-Coded Information** - Easy to understand at a glance

## 📊 Static Data

All data in the app is **static** and pre-loaded. This includes:
- Weather forecasts
- Sensor readings
- Crop health data
- Market prices
- Community posts
- News articles
- And more!

The app demonstrates a complete user experience without requiring any backend services.

## 🔧 Customization

### Change Static Data
Edit `lib/data/static_data.dart` to modify:
- Current weather
- Forecasts
- Alerts
- Recommendations
- And all other data

### Modify Theme
Edit `lib/theme/app_theme.dart` to change:
- Colors
- Typography
- Card styles
- Shadows and effects

## 📝 Notes

- The app is **fully functional** with static data
- Backend connectivity test will show failures (expected)
- All 166+ features are accessible
- No internet connection required
- Perfect for demos and presentations

## 🐛 Troubleshooting

### Build Errors
```bash
flutter clean
flutter pub get
flutter run
```

### Missing Dependencies
```bash
flutter pub get
```

### Hot Reload Not Working
Press `r` in terminal or restart the app

## 📚 Documentation

- **FEATURES.md** - Complete list of all 166+ features
- **ARCHITECTURE.md** - Technical architecture details
- **README.md** - Project overview

---

**Enjoy exploring ClimaPredict! 🌤️🌾**

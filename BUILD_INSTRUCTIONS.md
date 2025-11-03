# Build Instructions

This document provides step-by-step instructions for building ClimaPredict.

## Prerequisites

- Flutter SDK (>=3.7.0) - [Install Flutter](https://flutter.dev/docs/get-started/install)
- Android Studio with Android SDK (API 26+)
- JDK 11 or higher
- Git

## Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/climapredict.git
cd climapredict
```

## Step 2: Install Dependencies

```bash
flutter pub get
```

## Step 3: Generate Hive Adapters

**Important**: The data models use Hive for local storage. You must generate adapters:

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

This will generate `.g.dart` files for all models in `lib/models/`.

## Step 4: Add Model File (Optional)

For full functionality, add the TensorFlow Lite model:

1. Place `climapredict_v1.tflite` in `assets/models/`
2. Or the app will use fallback predictions

## Step 5: Run on Device/Emulator

### Debug Mode

```bash
flutter run
```

### Release Mode (APK)

```bash
flutter build apk --release --split-per-abi
```

For single APK (larger size):

```bash
flutter build apk --release
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

## Step 6: Build App Bundle (AAB) for Play Store

```bash
flutter build appbundle --release
```

Output: `build/app/outputs/bundle/release/app-release.aab`

## Troubleshooting

### Build Errors

1. **Hive adapter errors**: Run `flutter pub run build_runner build --delete-conflicting-outputs`
2. **Missing dependencies**: Run `flutter pub get`
3. **Android build errors**: Check `android/app/build.gradle.kts` and ensure minSdk is 26

### Common Issues

- **R8/ProGuard errors**: Check `android/app/proguard-rules.pro`
- **Model not found**: App will use fallback predictions
- **Bluetooth errors**: Ensure permissions are granted

## Verifying Build

1. Install APK on Android 8.0+ device
2. Complete onboarding flow
3. Verify forecast generation
4. Test offline mode (disable internet)
5. Check app size (should be <50MB base)

## Next Steps

See `README.md` for more information on running the backend and testing.


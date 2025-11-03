# APK Build Instructions

## Building Release APK

1. **Generate Hive Adapters** (required):
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

2. **Build APK**:
```bash
flutter build apk --release --split-per-abi
```

For single APK (larger size):
```bash
flutter build apk --release
```

3. **Locate APK**:
- Split APKs: `build/app/outputs/flutter-apk/app-armeabi-v7a-release.apk`
- Single APK: `build/app/outputs/flutter-apk/app-release.apk`

4. **Copy to apk/ directory**:
```bash
mkdir -p apk
cp build/app/outputs/flutter-apk/app-release.apk apk/ClimaPredict-demo.apk
```

## Verification

- APK size should be <50MB (base, without splits)
- Test on Android 8.0+ device
- Verify offline functionality
- Test all features

## Signing (Production)

For production release, sign the APK:
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore your-keystore.jks \
  apk/ClimaPredict-demo.apk your-key-alias

zipalign -v 4 apk/ClimaPredict-demo.apk apk/ClimaPredict-demo-signed.apk
```

## Notes

- Debug APK is acceptable for hackathon demos
- Release APK recommended for distribution
- Split APKs reduce download size per device


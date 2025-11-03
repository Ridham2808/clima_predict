# Flutter Environment Variables Setup

## Overview

ClimaPredict Flutter app uses `flutter_dotenv` package to load environment variables from `.env` file.

## Setup Steps

### 1. Create .env File

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Update .env File

Edit `.env` and add your backend API URL:

```env
API_BASE_URL=https://your-render-url.onrender.com
```

**Important**: Replace `https://your-render-url.onrender.com` with your actual Render backend URL.

### 3. Verify .env is in pubspec.yaml

The `.env` file is already added to `assets` in `pubspec.yaml`:
```yaml
assets:
  - .env
```

### 4. Load Environment Variables

The app automatically loads `.env` in `main.dart`. No additional code needed.

### 5. Using API URL in Code

The `ApiService` automatically uses the URL from `.env`:

```dart
// In ApiService, it uses:
final baseUrl = ApiConfig.baseUrl; // Reads from .env

// Or directly:
final apiUrl = dotenv.env['API_BASE_URL'];
```

## Example .env File

```env
# ClimaPredict Flutter App Environment Variables

# API Base URL (REQUIRED)
API_BASE_URL=https://climapredict-api.onrender.com

# Optional: API Key
# API_KEY=your_api_key_here
```

## Testing

1. Update `.env` with your backend URL
2. Run app: `flutter run`
3. Check logs for API calls
4. Verify requests go to correct URL

## Troubleshooting

### .env not loading
- Ensure `.env` is in project root (same level as `pubspec.yaml`)
- Check `pubspec.yaml` has `.env` in assets
- Verify file is not in `.gitignore` (or use `.env.example`)

### API calls failing
- Verify `API_BASE_URL` is correct
- Check backend is deployed and running
- Test backend URL in browser: `https://your-url.onrender.com/health`

### Build errors
- Run `flutter pub get` after updating pubspec.yaml
- Clean build: `flutter clean && flutter pub get`

## Git Ignore

**Important**: Add `.env` to `.gitignore` to avoid committing secrets:

```gitignore
.env
```

Keep `.env.example` in repository as template.


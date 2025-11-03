# Mobile App API Setup Guide

## How Mobile Apps Connect to Backend

### Step 1: Deploy Backend to Render

1. Follow `backend/DEPLOY_RENDER.md`
2. Get your Render URL: `https://your-app-name.onrender.com`
3. Test: `curl https://your-app-name.onrender.com/health`

### Step 2: Update Flutter App .env

1. Open `.env` file in project root
2. Add your Render URL:
   ```env
   API_BASE_URL=https://your-app-name.onrender.com
   ```
3. Save the file

### Step 3: Run Flutter App

```bash
flutter pub get
flutter run
```

## Important: No CORS Configuration Needed!

**Mobile apps don't need CORS configuration** because:
- ✅ Flutter apps use native HTTP client (not browser)
- ✅ No Origin header sent, so no CORS check
- ✅ Backend automatically accepts requests

### Backend Setup

The backend is already configured to accept mobile app requests:
- ✅ CORS allows requests without Origin (mobile apps)
- ✅ No additional configuration needed
- ✅ Just deploy and use the URL

## Testing Connection

### 1. Test Backend Health
```bash
curl https://your-app-name.onrender.com/health
```
Should return: `{"status":"ok","timestamp":"..."}`

### 2. Test from Flutter App
- Open app
- Complete onboarding
- Try to fetch forecast
- Check app logs for API calls

### 3. Check API Calls
In Flutter app logs, you should see:
```
GET https://your-app-name.onrender.com/api/v1/forecast?...
```

## Troubleshooting

### "Connection refused" Error
- Check Render service is running
- Verify URL is correct
- Check Render logs

### "CORS error" (Should not happen)
- This shouldn't occur with mobile apps
- If you see this, check backend CORS configuration

### API calls failing
- Verify `.env` file has correct URL
- Check `flutter pub get` was run
- Restart app after changing `.env`

## Summary

**For Mobile Apps:**
1. ✅ Deploy backend to Render
2. ✅ Add URL to Flutter `.env`
3. ✅ Run app - it will work!

**No CORS configuration needed for mobile apps!**


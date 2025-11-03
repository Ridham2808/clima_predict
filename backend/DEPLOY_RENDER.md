# Deploy ClimaPredict Backend to Render

## Step-by-Step Deployment Guide

### 1. Prepare Repository
- Ensure all backend files are committed
- Push to GitHub repository

### 2. Create Render Account
1. Go to https://render.com
2. Sign up/login with GitHub

### 3. Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the repository

### 4. Configure Service
- **Name**: `climapredict-api`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your deployment branch)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 5. Environment Variables
Add these in Render Dashboard → Environment:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/climapredict
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
MODEL_BUCKET=climapredict-models
MODEL_VERSION=v1.0.0
MODEL_SHA256=your_hash
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://your-frontend-url.com
```

### 6. MongoDB Setup (if using MongoDB Atlas)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `MONGODB_URI` in Render

### 7. Deploy
1. Click "Create Web Service"
2. Wait for build to complete
3. Copy the service URL (e.g., `https://climapredict-api.onrender.com`)

### 8. Update Frontend
1. Update `.env` file in Flutter app:
   ```
   API_BASE_URL=https://your-render-url.onrender.com
   ```
2. Rebuild Flutter app

### 9. Health Check
Test the API:
```bash
curl https://your-render-url.onrender.com/health
```

Should return: `{"status":"ok","timestamp":"..."}`

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be 16+)

### Service Doesn't Start
- Check start command is correct
- Verify PORT environment variable
- Check application logs

### Database Connection Issues
- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Render)
- Test connection string locally first

### CORS Errors
- Add frontend URL to `CORS_ORIGIN`
- Check API service logs

## Free Tier Limits
- Services sleep after 15 mins of inactivity
- First request may take 30-60 seconds (cold start)
- Upgrade to paid plan for always-on service

## Custom Domain (Optional)
1. Go to Settings → Custom Domains
2. Add your domain
3. Update DNS records
4. Update `CORS_ORIGIN` with new domain


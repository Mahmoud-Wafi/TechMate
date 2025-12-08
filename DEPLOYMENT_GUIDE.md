# 🚀 Complete Deployment Guide - TechMate (FREE Deployment)

This guide will help you deploy your TechMate project **completely free** using:
- **Backend**: Railway (Free tier available)
- **Frontend**: Vercel (Free tier available)
- **Database**: PostgreSQL (Free tier on Railway)

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ GitHub account with your TechMate repository
- ✅ Railway account (sign up at https://railway.app - free tier available)
- ✅ Vercel account (sign up at https://vercel.com - free tier available)
- ✅ Git installed on your local machine

---

## 🎯 Quick Overview

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (Vercel)      │────────▶│   (Railway)     │
│   React App     │         │   Django API    │
└─────────────────┘         └────────┬────────┘
                                     │
                              ┌──────▼──────┐
                              │  PostgreSQL │
                              │  Database   │
                              └─────────────┘
```

---

## 📝 Step 1: Prepare Your Repository

### 1.1 Ensure Files Are Committed

Make sure all your files are committed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2 Verify Required Files Exist

Your repository should have:
- ✅ `Backend/requirements.txt` (with gunicorn)
- ✅ `Backend/Procfile`
- ✅ `Backend/runtime.txt`
- ✅ `Frontend/package.json`
- ✅ `Frontend/vercel.json`
- ✅ `Backend/techmate/settings.py` (with production-ready settings)

---

## 🔧 Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account & Project

1. Go to **https://railway.app**
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub account
4. Click **"New Project"**
5. Select **"Deploy from GitHub repo"**
6. Choose your **TechMate** repository
7. Railway will detect it's a Django project

### 2.2 Configure Backend Settings

1. In Railway dashboard, click on your project
2. Click on the service that was created
3. Go to **Settings** tab
4. Set **Root Directory** to: `Backend`
5. Go to **Variables** tab to add environment variables

### 2.3 Add Environment Variables

Click **"New Variable"** and add each of these:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `SECRET_KEY` | `your-secret-key-here` | Generate a secure key (see below) |
| `DEBUG` | `False` | Must be False for production |
| `ALLOWED_HOSTS` | `your-app.up.railway.app` | Replace with your Railway URL |
| `DATABASE_URL` | _(auto-generated)_ | Railway creates this automatically |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` | Update after frontend deployment |

**Generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2.4 Add PostgreSQL Database

1. In Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically:
   - Create a PostgreSQL database
   - Set `DATABASE_URL` environment variable
   - Connect it to your Django service

### 2.5 Deploy & Verify

1. Railway will automatically start deploying
2. Watch the **Deployments** tab for build progress
3. Once deployed, note your **Railway URL** (e.g., `https://techmate-production.up.railway.app`)
4. Test the backend:
   - Visit: `https://your-railway-url.up.railway.app/api/tutorials/`
   - You should see: `[]` (empty array) or JSON response

### 2.6 Run Migrations

1. Go to Railway dashboard → Your service → **Settings**
2. Scroll to **"Deploy Script"** section
3. The Procfile should handle migrations automatically
4. If not working, go to **Settings** → **Connect** → **Generate Domain**
5. Then run migrations manually (optional):
   - Install Railway CLI: `npm i -g @railway/cli`
   - Run: `railway run python manage.py migrate`

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account & Project

1. Go to **https://vercel.com**
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Click **"Add New..."** → **"Project"**
5. Import your **TechMate** repository

### 3.2 Configure Frontend Settings

1. In project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `Frontend` (IMPORTANT!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.3 Add Environment Variables

Before deploying, add environment variable:

1. Go to **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-railway-url.up.railway.app` (from Step 2.5)
   - **Environments**: Production, Preview, Development
4. Click **"Save"**

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (usually 1-2 minutes)
3. Once deployed, note your **Vercel URL** (e.g., `https://techmate.vercel.app`)

### 3.5 Update Backend CORS Settings

1. Go back to **Railway** dashboard
2. Open your backend service → **Variables**
3. Update `CORS_ALLOWED_ORIGINS` to: `https://your-vercel-url.vercel.app`
4. Railway will automatically redeploy with new settings

### 3.6 Redeploy Frontend (if needed)

If you added `VITE_API_URL` after first deploy:
1. Go to Vercel dashboard
2. Click **Deployments** tab
3. Click **"..."** on latest deployment → **"Redeploy"**

---

## ✅ Step 4: Test Your Deployment

### 4.1 Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. You should see the TechMate homepage
3. Open browser console (F12) to check for errors

### 4.2 Test Backend API

1. Visit: `https://your-railway-url.up.railway.app/api/tutorials/`
2. Should return: `[]` (empty array)
3. Visit: `https://your-railway-url.up.railway.app/admin/`
4. Should show Django admin login page

### 4.3 Test User Registration

1. Go to frontend URL
2. Click **"Register"**
3. Fill in:
   - Email: `test@example.com`
   - Password: `Test12345!`
   - Confirm Password: `Test12345!`
   - Role: Student
4. Click **"Register"**
5. You should be redirected or see success message

### 4.4 Test Login

1. Use credentials from registration
2. Click **"Login"**
3. Enter email and password
4. Should successfully log in

---

## 🔐 Step 5: Create Admin User (Optional)

To access Django admin panel:

1. **Option A: Using Railway CLI** (Recommended)
   ```bash
   npm i -g @railway/cli
   railway login
   railway link  # Select your project
   railway run python manage.py createsuperuser
   ```

2. **Option B: Using Railway Web Terminal**
   - Go to Railway dashboard → Your service
   - Click **"Deployments"** → **"View Logs"**
   - Or use the web terminal if available

3. **Option C: Local with Railway Database**
   - Get `DATABASE_URL` from Railway → Variables
   - Set it locally: `export DATABASE_URL="your-url"`
   - Run: `python manage.py createsuperuser`

---

## 🔧 Step 6: Configure Media Files (Optional)

For production media files (images, videos), you have options:

### Option 1: Use Railway Volume (Limited)

1. In Railway → Your service → **Settings**
2. Add **Volume** mount
3. Mount to `/media` directory

### Option 2: Use Cloud Storage (Recommended)

1. Use services like:
   - AWS S3
   - Cloudinary
   - DigitalOcean Spaces
2. Update `settings.py` to use cloud storage
3. See Django documentation for cloud storage setup

**Note**: For free tier, media files on Railway may be temporary.

---

## 📊 Your Deployment URLs

After completing all steps, you'll have:

- **Frontend URL**: `https://your-app.vercel.app`
- **Backend API URL**: `https://your-app.up.railway.app`
- **Admin Panel**: `https://your-app.up.railway.app/admin/`
- **API Docs**: `https://your-app.up.railway.app/api/tutorials/`

---

## 🐛 Troubleshooting

### Backend Issues

#### ❌ Build Fails
- **Check**: Railway logs in **Deployments** tab
- **Common causes**:
  - Missing `gunicorn` in `requirements.txt` ✅ (Fixed)
  - Wrong `Root Directory` (should be `Backend`)
  - Missing environment variables

#### ❌ Database Connection Error
- **Check**: `DATABASE_URL` is set in Railway Variables
- **Solution**: Ensure PostgreSQL service is added and linked

#### ❌ CORS Errors
- **Check**: `CORS_ALLOWED_ORIGINS` includes your Vercel URL
- **Format**: `https://your-app.vercel.app` (no trailing slash)
- **Solution**: Update variable and redeploy

#### ❌ 500 Internal Server Error
- **Check**: Railway logs for detailed error
- **Common causes**:
  - `SECRET_KEY` not set
  - `DEBUG=True` in production (should be `False`)
  - Missing migrations

### Frontend Issues

#### ❌ Blank Page
- **Check**: Browser console (F12) for errors
- **Common causes**:
  - `VITE_API_URL` not set in Vercel
  - API URL incorrect
  - Build failed

#### ❌ API Connection Failed
- **Check**: `VITE_API_URL` in Vercel environment variables
- **Format**: `https://your-app.up.railway.app` (no trailing slash)
- **Test**: Visit API URL directly in browser

#### ❌ 404 on Routes
- **Check**: `vercel.json` exists in `Frontend/` directory
- **Solution**: Ensure rewrites are configured

---

## 🔄 Updating Your Deployment

### Update Backend

1. Make changes to code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push origin main
   ```
3. Railway will automatically redeploy

### Update Frontend

1. Make changes to code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```
3. Vercel will automatically redeploy

---

## 📝 Environment Variables Summary

### Backend (Railway)

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.up.railway.app
DATABASE_URL=postgresql://... (auto-generated by Railway)
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-app.up.railway.app
```

---

## 🎉 Deployment Complete!

Your TechMate application is now live! 🚀

### Next Steps:

1. ✅ Test all features (registration, login, tutorials)
2. ✅ Create admin user for content management
3. ✅ Add some sample tutorials
4. ✅ Share your app with users!

---

## 📚 Additional Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Django Deployment**: https://docs.djangoproject.com/en/stable/howto/deployment/
- **React Deployment**: https://react.dev/learn/start-a-new-react-project

---

## 💡 Tips for Production

1. **Monitor Usage**: Check Railway and Vercel dashboards regularly
2. **Backup Database**: Railway free tier has automatic backups
3. **Set Up Domain**: Both platforms allow custom domains (paid feature)
4. **Enable HTTPS**: Automatically enabled on both platforms
5. **Monitor Logs**: Check logs regularly for errors

---

**Need Help?** Check the troubleshooting section or create an issue on GitHub!

**Happy Deploying! 🎊**



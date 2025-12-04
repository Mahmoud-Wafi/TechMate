# TechMate Deployment Guide

Deploy your app for free using Vercel (Frontend) + Railway (Backend).

---

## 🚀 Backend Deployment (Django on Railway)

### Step 1: Prepare Backend for Deployment

Already done! Files created:
- ✅ `Procfile` - tells Railway how to run your app
- ✅ `runtime.txt` - specifies Python version
- ✅ `requirements.txt` - updated with gunicorn & whitenoise
- ✅ `techmate/settings.py` - updated with WhiteNoise middleware

### Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Step 3: Connect GitHub Repository

1. In Railway, click "New Project" → "Deploy from GitHub"
2. Select your TechMate repository
3. Select the `Backend` directory as root directory
4. Railway auto-detects it's a Django project

### Step 4: Configure Environment Variables in Railway

In Railway dashboard, go to Variables and add:

```
DEBUG=False
SECRET_KEY=<generate-random-key>
SESSION_SECRET=<generate-random-key>

# These are auto-set by Railway when you add PostgreSQL plugin:
# PGHOST
# PGPORT
# PGDATABASE
# PGUSER
# PGPASSWORD

CORS_ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
```

**Generate secure keys:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### Step 5: Add PostgreSQL Database

In Railway:
1. Click "Add Service" → "Add from Marketplace"
2. Select "PostgreSQL"
3. Confirm
4. Railway auto-injects `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

### Step 6: Deploy

Railway auto-deploys on every GitHub push. First deployment:
1. Click "Deploy" button
2. Watch logs to ensure migrations run
3. Your API will be live at: `https://your-app.railway.app`

**Verify deployment:**
```bash
curl https://your-app.railway.app/api/tutorials/
```

---

## 🎨 Frontend Deployment (React on Vercel)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your TechMate repository

### Step 2: Configure Vercel Project

In Vercel dashboard:
1. Select "Import Git Repository"
2. Select TechMate repo
3. Select "Frontend" as root directory
4. Click "Deploy"

### Step 3: Set Environment Variables in Vercel

After import, go to project settings:

1. Click "Settings" → "Environment Variables"
2. Add:
   ```
   VITE_API_URL = https://your-railway-backend.railway.app
   ```
3. Make sure it's available for `Production`, `Preview`, and `Development`

### Step 4: Redeploy

1. In Vercel, click "Deployments"
2. Click the latest deployment's menu → "Redeploy"
3. Your frontend will be live at: `https://your-project.vercel.app`

---

## 🔗 Connect Frontend & Backend

After both are deployed:

### 1. Update Frontend Environment

In Vercel project settings, update:
```
VITE_API_URL=https://<railway-backend-url>.railway.app
```

### 2. Update Backend CORS

In Railway variables, update:
```
CORS_ALLOWED_ORIGINS=https://<vercel-frontend>.vercel.app
```

### 3. Test Connection

Frontend will now correctly call your backend API.

---

## 📋 Deployment Checklist

**Backend (Railway):**
- [ ] GitHub repo connected
- [ ] PostgreSQL database added
- [ ] Environment variables set
- [ ] `DEBUG=False` in production
- [ ] `SECRET_KEY` is secure & unique
- [ ] `CORS_ALLOWED_ORIGINS` points to Vercel frontend
- [ ] First deployment successful (check logs)
- [ ] Run `python manage.py createsuperuser` in Railway shell (optional)

**Frontend (Vercel):**
- [ ] GitHub repo imported
- [ ] Root directory set to `Frontend`
- [ ] `VITE_API_URL` environment variable set
- [ ] Build command: `npm run build` ✓
- [ ] Output directory: `dist` ✓
- [ ] Deployment successful
- [ ] Can access at `https://your-project.vercel.app`

---

## 🔧 Common Issues & Fixes

### Backend Issues

**Error: "ModuleNotFoundError"**
- Railway didn't install requirements.txt
- Solution: Commit changes and push to trigger rebuild

**Error: "Database connection refused"**
- PostgreSQL not added to Railway
- Solution: Add PostgreSQL plugin in Railway dashboard

**Error: "CORS error from frontend"**
- CORS_ALLOWED_ORIGINS not set correctly
- Solution: Set it to exact Vercel URL (include https://)

### Frontend Issues

**API calls return 404**
- `VITE_API_URL` not set in Vercel
- Solution: Check Vercel Environment Variables
- Redeploy after changing env vars

**Build fails with "vite build error"**
- Missing dependencies
- Solution: Check `package.json`, run `npm install` locally

**Blank page on load**
- API not responding
- Solution: Verify backend is running and CORS is configured

---

## 🛠️ Manual Database Setup (First Time)

If migrations don't run automatically:

In Railway dashboard:
1. Click your project
2. Go to Deployments → Latest
3. Click "Logs" tab → find "Shell" or "Terminal"
4. Run:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

---

## 📊 Monitoring & Logs

**Railway:**
- Click project → Deployments → Latest → Logs

**Vercel:**
- Click project → Deployments → Latest → Logs

---

## 💰 Free Tier Limits

**Railway:**
- Free tier: $5/month credits (usually enough for small projects)
- 500 hours/month
- 100GB bandwidth/month

**Vercel:**
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic scaling

---

## 🚀 Next Steps

1. Deploy backend first (Railway)
2. Deploy frontend second (Vercel)
3. Connect them via environment variables
4. Test complete workflows
5. Monitor logs for issues

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Django Deployment: https://docs.djangoproject.com/en/5.2/howto/deployment/

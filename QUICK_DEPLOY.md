# ⚡ Quick Deploy Guide - 5 Minutes

Follow these steps to deploy TechMate in under 5 minutes!

---

## 🚀 Step 1: Deploy Backend (2 minutes)

1. **Go to Railway**: https://railway.app
2. **Login** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select** TechMate repository
5. **Settings** → Set Root Directory: `Backend`
6. **Variables** → Add these:
   ```
   SECRET_KEY=run-this-command: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   DEBUG=False
   ```
7. **Add PostgreSQL** → Click "+ New" → "Database" → "Add PostgreSQL"
8. **Copy your Railway URL** (shown after deployment)

---

## 🎨 Step 2: Deploy Frontend (2 minutes)

1. **Go to Vercel**: https://vercel.com
2. **Login** with GitHub
3. **Add New** → **Project**
4. **Import** TechMate repository
5. **Settings**:
   - Root Directory: `Frontend`
   - Framework Preset: `Vite`
6. **Environment Variables** → Add:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
   (Replace with your Railway URL from Step 1)
7. **Deploy**
8. **Copy your Vercel URL**

---

## 🔗 Step 3: Connect Frontend & Backend (1 minute)

1. **Back to Railway** → Your service → **Variables**
2. **Update** `CORS_ALLOWED_ORIGINS`:
   ```
   https://your-vercel-url.vercel.app
   ```
3. **Railway auto-redeploys** ✅

---

## ✅ Done! Test It

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.up.railway.app/api/tutorials/
- **Admin**: https://your-app.up.railway.app/admin/

**Try registering a user** - it should work! 🎉

---

## 📖 Need More Details?

See `DEPLOYMENT_GUIDE.md` for comprehensive instructions.



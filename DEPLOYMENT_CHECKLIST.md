# ✅ Deployment Checklist

Use this checklist to ensure everything is ready for deployment.

## Pre-Deployment Checklist

### Repository
- [ ] All code committed to GitHub
- [ ] Repository is public or connected to Railway/Vercel
- [ ] `.gitignore` properly configured (excludes `env/`, `node_modules/`, etc.)

### Backend Files
- [ ] `Backend/requirements.txt` exists and includes `gunicorn`
- [ ] `Backend/Procfile` exists with correct gunicorn command
- [ ] `Backend/runtime.txt` exists with Python version
- [ ] `Backend/techmate/settings.py` is production-ready
- [ ] Media files handled (volume or cloud storage)

### Frontend Files
- [ ] `Frontend/package.json` exists
- [ ] `Frontend/vercel.json` exists with rewrites configuration
- [ ] `Frontend/vite.config.js` configured correctly
- [ ] `Frontend/src/services/api.js` uses `VITE_API_URL` environment variable

---

## Railway (Backend) Deployment

### Setup
- [ ] Railway account created
- [ ] Project created from GitHub repo
- [ ] Root directory set to `Backend`

### Environment Variables
- [ ] `SECRET_KEY` added (secure random key)
- [ ] `DEBUG` set to `False`
- [ ] `ALLOWED_HOSTS` set (will update after deployment)
- [ ] PostgreSQL database added
- [ ] `DATABASE_URL` automatically set by Railway
- [ ] `CORS_ALLOWED_ORIGINS` added (will update with frontend URL)

### Deployment
- [ ] Build succeeded (check Deployments tab)
- [ ] Service is running (green status)
- [ ] Backend URL noted (e.g., `https://xxx.up.railway.app`)
- [ ] API tested: `https://your-url/api/tutorials/` returns JSON

---

## Vercel (Frontend) Deployment

### Setup
- [ ] Vercel account created
- [ ] Project imported from GitHub repo
- [ ] Root directory set to `Frontend`
- [ ] Framework preset: `Vite`

### Environment Variables
- [ ] `VITE_API_URL` set to Railway backend URL
- [ ] Variable saved for Production, Preview, Development

### Deployment
- [ ] Build succeeded
- [ ] Frontend URL noted (e.g., `https://xxx.vercel.app`)
- [ ] Frontend loads without errors
- [ ] Browser console shows no API connection errors

---

## Post-Deployment Configuration

### Update CORS
- [ ] Updated `CORS_ALLOWED_ORIGINS` in Railway with Vercel URL
- [ ] Backend redeployed with new CORS settings

### Testing
- [ ] Frontend homepage loads
- [ ] User registration works
- [ ] User login works
- [ ] API calls successful (check browser network tab)
- [ ] No CORS errors in console

### Optional Setup
- [ ] Admin user created (`python manage.py createsuperuser`)
- [ ] Admin panel accessible: `https://backend-url/admin/`
- [ ] Media files storage configured (if needed)

---

## Quick Commands Reference

### Generate SECRET_KEY
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Railway CLI Commands
```bash
npm i -g @railway/cli
railway login
railway link
railway run python manage.py migrate
railway run python manage.py createsuperuser
```

### Local Testing
```bash
# Backend
cd Backend
python manage.py runserver

# Frontend
cd Frontend
npm install
npm run dev
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build fails on Railway | Check logs, verify Root Directory is `Backend` |
| Blank page on Vercel | Check `VITE_API_URL` is set correctly |
| CORS errors | Update `CORS_ALLOWED_ORIGINS` in Railway |
| Database errors | Verify PostgreSQL service is added and linked |
| 500 errors | Check Railway logs, verify `SECRET_KEY` is set |

---

## Your Deployment URLs

Fill these in after deployment:

- **Backend URL**: `_________________________________`
- **Frontend URL**: `_________________________________`
- **Admin Panel**: `_________________________________`

---

**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

**Date Completed**: _______________



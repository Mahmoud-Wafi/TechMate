# Quick Deployment (5 minutes)

## Backend (Railway)

```bash
# 1. Go to https://railway.app → Sign up with GitHub

# 2. Create new project → Deploy from GitHub → Select TechMate

# 3. In Railway dashboard, add these environment variables:
DEBUG=False
SECRET_KEY=run this: python -c "import secrets; print(secrets.token_urlsafe(50))"
CORS_ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app

# 4. Click "Add Service" → "PostgreSQL" → Confirm
# (Railway auto-injects DB variables)

# 5. Click "Deploy" → Done! ✅
# Your backend URL: https://techmate-production-xxxx.railway.app
```

## Frontend (Vercel)

```bash
# 1. Go to https://vercel.com → Sign up with GitHub

# 2. Click "Add New" → "Project" → Import TechMate repository

# 3. Important: Set root directory to "Frontend" (not root!)

# 4. Add environment variable:
VITE_API_URL=https://your-railway-backend-url.railway.app

# 5. Click "Deploy" → Done! ✅
# Your frontend URL: https://your-project-name.vercel.app
```

## Connect Them

In **Railway dashboard**, update:
```
CORS_ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
```

Done! Test by visiting your Vercel frontend → should work perfectly 🎉

## Generate Secure Keys

```bash
# Run this locally and use the output:
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Frontend shows blank page | Check VITE_API_URL in Vercel env vars, redeploy |
| API returns 404 | Verify backend URL is correct, check logs |
| Database error | Add PostgreSQL plugin in Railway |
| CORS error | Update CORS_ALLOWED_ORIGINS in Railway |

---

**Full guide:** See `DEPLOYMENT.md` for detailed instructions.

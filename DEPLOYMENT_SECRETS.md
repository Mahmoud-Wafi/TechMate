# Secure Secrets Setup for Deployment

## 🔐 Generate Your Secrets

Run this command in the project root:

```bash
python3 generate_secrets.py
```

You'll get output like:
```
SECRET_KEY=ZWWluk471ODG3jMciyD5fIJcpS4Mg6aVDrYLRNE3czzudA_lI7nc6d9eqA_L2_yuRR8
SESSION_SECRET=ZWWluk471ODG3jMciyD5fIJcpS4Mg6aVDrYLRNE3czzudA_lI7nc6d9eqA_L2_yuRR8
JWT_SECRET_KEY=hStq321GgTlL04X2K0ABeuS9t-44jWcIQ56BZVSjI7yCtLxObT5EYzYuRnZd_H2JP-Y
```

## ✅ Add to Railway (Backend)

1. Go to [railway.app](https://railway.app)
2. Select your TechMate project
3. Go to "Variables" tab
4. Add these environment variables:

```
DEBUG=False
SECRET_KEY=<paste from above>
SESSION_SECRET=<paste from above>
JWT_SECRET_KEY=<paste from above>
CORS_ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
```

**Important:** Replace `https://your-vercel-frontend.vercel.app` with your actual Vercel URL.

## ✅ Add to Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com)
2. Select your TechMate project
3. Go to "Settings" → "Environment Variables"
4. Add:

```
VITE_API_URL=https://your-railway-backend.railway.app
```

**Important:** Replace `https://your-railway-backend.railway.app` with your actual Railway URL.

## 🔒 Security Best Practices

✅ **Do:**
- Use strong random secrets (generated above)
- Store secrets in platform variables, never in code
- Use HTTPS (both Vercel and Railway auto-use HTTPS)
- Keep `.env` files out of Git (already in `.gitignore`)
- Rotate secrets periodically

❌ **Don't:**
- Commit `.env.production` to Git
- Share your secrets with anyone
- Use default/weak passwords
- Use same secret for multiple environments
- Store secrets in comments or documentation

## 🔄 Update Secrets

To update secrets after deployment:

1. **Backend:** Update in Railway Variables → auto redeploy (or push to GitHub)
2. **Frontend:** Update in Vercel Environment Variables → click "Redeploy"

## 🚨 If Secrets Are Exposed

1. Generate new secrets immediately (run `python3 generate_secrets.py`)
2. Update Railway variables
3. Update Vercel variables
4. Redeploy both services
5. If database accessed, consider rotating API keys

---

See `DEPLOYMENT.md` for full deployment guide.

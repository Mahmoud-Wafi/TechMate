# 🔧 Fixing 400 Bad Request Error on Railway

## ❌ The Problem

You're seeing a **400 Bad Request** error when accessing:
```
https://techmate-production.up.railway.app/
```

This is a **Django ALLOWED_HOSTS** error. Django rejects requests when the `Host` header doesn't match your `ALLOWED_HOSTS` setting.

---

## ✅ The Solution

### Option 1: Set ALLOWED_HOSTS in Railway (Recommended)

1. **Go to Railway Dashboard**
   - Open your project
   - Click on your Django service
   - Go to **Variables** tab

2. **Add Environment Variable**
   - Click **"New Variable"**
   - **Name**: `ALLOWED_HOSTS`
   - **Value**: `techmate-production.up.railway.app`
   - Click **Save**

3. **Redeploy**
   - Railway will automatically redeploy
   - Wait for deployment to complete
   - Try accessing your URL again

### Option 2: Use Wildcard (Quick Fix)

If you want to allow all Railway subdomains:

1. **In Railway Variables**
   - **Name**: `ALLOWED_HOSTS`
   - **Value**: `*.up.railway.app,techmate-production.up.railway.app`
   - Click **Save**

**Note**: The updated `settings.py` now automatically detects Railway's domain, but setting `ALLOWED_HOSTS` explicitly is still recommended.

---

## 🔍 Verify Your Settings

After updating, check Railway logs:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Check **Logs** to see if there are any errors

You should see Django starting successfully without ALLOWED_HOSTS warnings.

---

## 📋 Other Common Causes of 400 Errors

### 1. Missing SECRET_KEY
- **Check**: Railway Variables tab
- **Fix**: Add `SECRET_KEY` with a secure random value
- **Generate**: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`

### 2. Database Connection Issue
- **Check**: Railway Variables - `DATABASE_URL` should be auto-set
- **Fix**: Make sure PostgreSQL service is added and linked
- **Verify**: Check logs for database connection errors

### 3. Missing Migrations
- **Check**: Railway logs for migration errors
- **Fix**: The Procfile should run migrations automatically, but verify in logs

### 4. DEBUG Setting
- **Check**: Railway Variables - `DEBUG` should be `False` in production
- **Note**: When `DEBUG=False`, Django is stricter about ALLOWED_HOSTS

---

## 🧪 Test Your Fix

After setting `ALLOWED_HOSTS`:

1. **Wait for redeployment** (usually 30-60 seconds)
2. **Test the root URL**: `https://techmate-production.up.railway.app/`
   - Should return a response (even if 404, that's better than 400)
3. **Test API endpoint**: `https://techmate-production.up.railway.app/api/tutorials/`
   - Should return `[]` or JSON data
4. **Test admin**: `https://techmate-production.up.railway.app/admin/`
   - Should show Django admin login page

---

## 📝 Quick Checklist

- [ ] `ALLOWED_HOSTS` set in Railway Variables
- [ ] `SECRET_KEY` set in Railway Variables
- [ ] `DEBUG=False` in Railway Variables
- [ ] PostgreSQL database added and linked
- [ ] Service redeployed after variable changes
- [ ] No errors in Railway logs

---

## 🎯 Exact Steps for Your Case

Based on your URL `techmate-production.up.railway.app`:

1. Railway Dashboard → Your Service → **Variables**
2. Click **"New Variable"**
3. Add:
   ```
   Name: ALLOWED_HOSTS
   Value: techmate-production.up.railway.app
   ```
4. Click **Save**
5. Wait for automatic redeploy (~30 seconds)
6. Test: `https://techmate-production.up.railway.app/api/tutorials/`

---

## 🆘 Still Getting 400?

1. **Check Railway Logs**
   - Go to Deployments → View Logs
   - Look for Django startup messages
   - Check for ALLOWED_HOSTS warnings

2. **Verify Environment Variables**
   - Make sure variables are saved
   - Check for typos
   - Ensure no extra spaces

3. **Check Service Status**
   - Is the service running? (green indicator)
   - Is there a build error?
   - Check recent deployments

4. **Test with curl**
   ```bash
   curl -I https://techmate-production.up.railway.app/api/tutorials/
   ```
   This shows the actual HTTP status code.

---

## ✅ Expected Success Response

After fixing, you should see:

**For API endpoint:**
```json
[]
```

**For root URL:**
- May return 404 (which is fine, means Django is working)
- Or redirect to `/admin/` or `/api/`

**For admin:**
- Django admin login page

---

## 📚 Related Files

- `Backend/techmate/settings.py` - Contains ALLOWED_HOSTS logic
- `ENV_TEMPLATE.md` - Environment variables reference

---

**After fixing, your app should work! 🎉**

If you still have issues, share the Railway logs and I'll help debug further.


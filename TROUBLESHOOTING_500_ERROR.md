# 🔧 Fixing 500 Internal Server Error on Registration/Login

## ❌ The Problem

You're seeing a **500 Internal Server Error** when trying to:
- Register a new user
- Login to an existing account

Error: `POST https://techmate-production.up.railway.app/api/auth/register/ 500 (Internal Server Error)`

This means the server encountered an unexpected error. Common causes:

---

## 🔍 Common Causes & Solutions

### 1. **Database Migrations Not Run** (MOST LIKELY)

**Problem**: The database tables (especially `Profile` table) don't exist.

**Solution**: Run migrations on Railway

**Option A: Using Railway CLI** (Recommended)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run migrations
railway run python manage.py migrate
```

**Option B: Check Procfile**
- Ensure your `Procfile` has: `release: python manage.py migrate --noinput`
- Railway should run this automatically, but check deployment logs

**Option C: Manual Migration via Railway Dashboard**
1. Go to Railway → Your Service → **Deployments**
2. Look for the deployment that ran migrations
3. Check logs for migration errors
4. If migrations failed, check why in the logs

---

### 2. **Missing SECRET_KEY**

**Problem**: Django needs `SECRET_KEY` to work properly.

**Solution**: 
1. Railway Dashboard → Your Service → **Variables**
2. Ensure `SECRET_KEY` is set
3. Generate one if missing:
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

---

### 3. **Database Connection Issue**

**Problem**: Django can't connect to PostgreSQL.

**Check**:
1. Railway Dashboard → Is PostgreSQL service added?
2. Railway Dashboard → Variables → Is `DATABASE_URL` set?
3. Check Railway logs for database connection errors

**Solution**:
1. Add PostgreSQL service if missing:
   - Railway Dashboard → **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Ensure it's linked to your Django service
3. Railway should auto-set `DATABASE_URL`

---

### 4. **Profile Model Missing**

**Problem**: The `accounts_profile` table doesn't exist in database.

**Check Railway Logs**:
1. Go to Railway → Deployments → Latest deployment
2. Check for errors like:
   - `relation "accounts_profile" does not exist`
   - `no such table: accounts_profile`

**Solution**: Run migrations (see Solution #1 above)

---

## 🛠️ Step-by-Step Fix

### Step 1: Check Railway Logs

1. **Go to Railway Dashboard**
2. **Open your Django service**
3. **Click "Deployments" tab**
4. **Click on latest deployment**
5. **Check "Logs" section**

Look for:
- Migration errors
- Database connection errors
- Python traceback errors

**Share the error message** - this will tell us exactly what's wrong.

---

### Step 2: Verify Database Setup

1. **Railway Dashboard** → Check if PostgreSQL service exists
2. **Check Variables**:
   - `DATABASE_URL` should be auto-set
   - `SECRET_KEY` should be set
   - `DEBUG=False`
   - `ALLOWED_HOSTS` should include your Railway URL

---

### Step 3: Run Migrations

**Using Railway CLI**:
```bash
railway login
railway link
railway run python manage.py migrate
```

**Or verify Procfile** has:
```
release: python manage.py migrate --noinput
web: gunicorn techmate.wsgi:application --bind 0.0.0.0:$PORT --workers 2
```

---

### Step 4: Verify Migrations Ran

**Check if tables exist** (optional):
```bash
railway run python manage.py showmigrations
```

All migrations should show `[X]` (applied), not `[ ]` (pending).

---

### Step 5: Test Again

After migrations:
1. Wait for Railway to redeploy (if needed)
2. Try registration again
3. Check Railway logs if still failing

---

## 🔎 How to Get Detailed Error Info

The updated code now includes better error handling. Check Railway logs for:

1. **Full traceback** - shows exactly where the error occurred
2. **Error message** - tells you what went wrong
3. **Stack trace** - shows the code path

**To see logs**:
- Railway Dashboard → Your Service → Deployments → Latest → Logs
- Or use Railway CLI: `railway logs`

---

## 📋 Quick Checklist

Before testing registration:

- [ ] PostgreSQL database added to Railway project
- [ ] `DATABASE_URL` environment variable is set (auto by Railway)
- [ ] `SECRET_KEY` environment variable is set
- [ ] `DEBUG=False` in production
- [ ] `ALLOWED_HOSTS` includes your Railway URL
- [ ] Migrations have been run successfully
- [ ] No errors in Railway deployment logs
- [ ] Service is running (green status)

---

## 🧪 Test Registration After Fix

Once everything is set up:

1. **Go to your frontend**: `https://your-app.vercel.app`
2. **Try registering** with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test12345!`
   - Confirm Password: `Test12345!`
   - Name: `Test User`
   - Role: `student`

3. **Expected Result**:
   - ✅ Success message
   - ✅ Redirected to home/dashboard
   - ✅ User logged in

4. **If Still Failing**:
   - Check browser console for error messages
   - Check Railway logs for server errors
   - Share the error message

---

## 🚨 Most Common Issue: Migrations

**90% of 500 errors on registration are due to missing migrations.**

The `Profile` model needs to exist in the database. If migrations haven't run, Django will crash when trying to create a Profile during registration.

**Quick Fix**:
```bash
railway run python manage.py migrate
```

---

## 📞 Still Not Working?

If you've tried everything:

1. **Share Railway logs** from the latest deployment
2. **Share the exact error** from browser console
3. **Verify these**:
   - Database is running
   - Migrations completed
   - No errors in logs

The updated code now provides better error messages to help debug.

---

## ✅ Expected Success

After fixing, you should see:

**Registration Response**:
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "profile": {
      "name": "Test User",
      "age": null,
      "role": "student",
      "is_approved_instructor": false
    }
  },
  "tokens": {
    "refresh": "...",
    "access": "..."
  }
}
```

---

**Most likely fix**: Run migrations! 🎯

```bash
railway run python manage.py migrate
```



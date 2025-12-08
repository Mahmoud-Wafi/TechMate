# 🔧 Fix: Migrations Not Running on Railway

## ❌ Problem

Your deployment logs show:
- ✅ Build successful
- ✅ Packages installed
- ✅ Gunicorn starting
- ❌ **NO migrations being run!**

The `release` command in Procfile should run migrations, but Railway might not be executing it automatically.

---

## ✅ Solution: Run Migrations Manually

### Option 1: Using Railway CLI (Fastest)

```bash
# Install Railway CLI (if not already installed)
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project (it will show a list - select your TechMate project)
railway link

# Run migrations
railway run python manage.py migrate

# Verify migrations
railway run python manage.py showmigrations
```

**Expected output**: All migrations should show `[X]` (applied)

---

### Option 2: Add Startup Script

Create a startup script that runs migrations before starting the server:

1. **Create `Backend/start.sh`**:
```bash
#!/bin/bash
set -e

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
exec gunicorn techmate.wsgi:application --bind 0.0.0.0:$PORT --workers 2
```

2. **Update `Procfile`**:
```
web: bash start.sh
```

3. **Make script executable** (commit this):
```bash
chmod +x Backend/start.sh
```

4. **Commit and push**:
```bash
git add Backend/start.sh Backend/Procfile
git commit -m "Add startup script to run migrations automatically"
git push origin main
```

---

### Option 3: Use Railway's Deploy Hook

Railway might support deploy hooks. Check if you can add a post-deploy script in Railway settings.

---

## 🔍 Verify Migrations Status

After running migrations manually, verify:

```bash
railway run python manage.py showmigrations
```

You should see:
```
accounts
 [X] 0001_initial
 [X] 0002_profile_is_approved_instructor

tutorials
 [X] 0001_initial
 [X] 0002_certificate

...
```

All should have `[X]`, not `[ ]`.

---

## 🚀 Quick Fix Right Now

**Run this immediately**:

```bash
railway run python manage.py migrate
```

Then test registration again. This should fix the 500 error immediately.

---

## 📝 Why This Happens

Railway's build process:
1. ✅ Builds your app
2. ✅ Installs dependencies
3. ✅ Starts gunicorn
4. ❌ **May skip the `release` command**

Some platforms run `release` automatically, but Railway might not in all cases. The startup script approach (Option 2) is more reliable.

---

## ✅ Recommended: Use Startup Script

The startup script ensures migrations ALWAYS run before the server starts, even if Railway changes how it handles Procfile release commands.

**Steps**:
1. Create `Backend/start.sh` (code above)
2. Update `Procfile` to use `bash start.sh`
3. Commit and push
4. Railway will redeploy and migrations will run automatically

---

## 🧪 Test After Fix

After running migrations:

1. **Test Registration**:
   - Go to your frontend
   - Try registering a new user
   - Should work without 500 error

2. **Check Database**:
   ```bash
   railway run python manage.py shell
   ```
   Then in Python shell:
   ```python
   from accounts.models import Profile
   Profile.objects.count()  # Should show 0 or number of users
   ```

---

## 📊 Your Current Situation

Based on your logs:
- ✅ Server is running (gunicorn started)
- ✅ Code is deployed
- ❌ Database tables don't exist (migrations not run)
- ❌ Registration fails because `Profile` table missing

**Fix**: Run `railway run python manage.py migrate` now, then implement Option 2 for automatic migrations in future deployments.

---

**Run migrations now, then implement the startup script! 🎯**



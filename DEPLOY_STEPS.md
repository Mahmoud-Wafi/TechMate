# Complete Deployment Guide - TechMate

## ✅ Prerequisites

- GitHub account (already set up)
- Railway account (free: https://railway.app)
- Vercel account (free: https://vercel.com)

---

## 🚀 Step 1: Deploy Backend (Railway)

### 1.1 Create Railway Project

1. Go to https://railway.app
2. Sign in with GitHub
3. Click **New Project** → **Deploy from GitHub**
4. Select your **Mahmoud-Wafi/TechMate** repository
5. When prompted for **Root Directory**, select `Backend`
6. Click **Deploy**

### 1.2 Wait for Initial Build

Railway will start building. In the left sidebar, you'll see:
- Status changes from "Building" to "Deploying"
- Once done, you'll see a URL like: `https://techmate-production.up.railway.app`

### 1.3 Verify Backend Works

Visit: `https://techmate-production.up.railway.app/api/tutorials/`

You should see:
```json
[]
```

If you see an error, check the **Logs** tab in Railway for details.

---

## 🎨 Step 2: Deploy Frontend (Vercel)

### 2.1 Create Vercel Project

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **Add New** → **Project**
4. Select **Mahmoud-Wafi/TechMate** repository
5. **IMPORTANT:** Set **Root Directory** to `Frontend`
6. Click **Deploy**

### 2.2 Add Environment Variable

1. After deploy, go to **Settings** → **Environment Variables**
2. Add:
   - Name: `VITE_API_URL`
   - Value: `https://techmate-production.up.railway.app`
   (Replace with your actual Railway URL from Step 1.2)
3. Click **Add**

### 2.3 Redeploy

1. Go to **Deployments** tab
2. Click latest deployment → **...** menu → **Redeploy**
3. Wait for build to complete

### 2.4 Verify Frontend Works

Visit your Vercel URL (shown in Deployments): `https://your-project-name.vercel.app`

You should see the TechMate home page.

---

## ✅ Step 3: Test Everything

### 3.1 Test Registration

1. Visit frontend URL
2. Click **Register**
3. Fill in:
   - Email: `test@example.com`
   - Password: `Test12345`
   - Confirm Password: `Test12345`
   - Role: Student
4. Click **Register**

### 3.2 Expected Result

- ✅ Registration succeeds
- ✅ User created in database
- ✅ Can login with same credentials

### 3.3 If Registration Fails

Check browser console (F12 → Console tab) for errors. Common issues:

| Error | Fix |
|-------|-----|
| CORS error | Check Railway CORS is set to `https://your-vercel-url.vercel.app` |
| 404 Not Found | Check VITE_API_URL is set correctly in Vercel |
| Connection refused | Backend may be down - check Railway logs |

---

## 📊 Your Deployment URLs

After completing above:

- **Backend API:** `https://techmate-production.up.railway.app`
- **Frontend:** `https://your-project-name.vercel.app`
- **Admin Panel:** `https://techmate-production.up.railway.app/admin/`

---

## 🔧 Troubleshooting

### Backend Not Responding

1. Go to Railway → **Logs** tab
2. Look for error messages
3. Most common: Application didn't start
4. Solution: Check if Procfile and requirements.txt are correct

### Frontend Shows Blank Page

1. Open browser console (F12)
2. Look for errors
3. Most common: VITE_API_URL not set in Vercel
4. Solution: Re-check Step 2.2

### Registration Fails

1. Check browser console for CORS errors
2. If CORS error: Make sure Railway CORS allows your Vercel URL
3. Test backend API directly: `https://your-railway-url/api/tutorials/`

---

## ✨ Next Steps

1. Create superuser for admin panel (optional)
2. Add sample tutorials
3. Test complete workflows (login, browse, register)

---

**Deployment Complete! 🎉**

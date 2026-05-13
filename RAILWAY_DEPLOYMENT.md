# Railway Deployment Guide - Complete Setup

## 🚀 Deployment Overview

Your application will be deployed on **Railway.app** with:
- ✅ **Backend API** (FastAPI) - Free tier
- ✅ **Frontend** (Angular) - Free tier
- ✅ **PostgreSQL Database** - Free tier (100MB storage)
- ✅ **Total Cost**: $0/month (for 5 users)

**Timeline**: 20 minutes total

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub account created and verified
- [ ] Repository pushed to GitHub (https://github.com/username/repository)
- [ ] Your SECRET_KEY: `a5EJBgjas4WmTSJTZnXBnaXHMr4eXUWapJ_EmwVias4`
- [ ] Telegram bot token (optional, for notifications)
- [ ] Email address for Railway account

---

## ⚙️ Phase 1: Create Railway Account

**Step 1: Go to Railway**
- Open: https://railway.app
- Click "Sign up" (top right)

**Step 2: Choose Sign-In Method**
- Click "Continue with GitHub" (easiest option)
- Accept permissions

**Step 3: Authorize GitHub**
- Allow Railway to access your repositories
- You'll be redirected to Railway dashboard

✅ **Result**: You're logged in to Railway

---

## 🗄️ Phase 2: Deploy PostgreSQL Database (First!)

**Step 1: Create New Project**
- In Railway dashboard, click "New Project"
- Click "Provision PostgreSQL"
- Select "PostgreSQL" from the list

**Step 2: Configure Database**
- Database will auto-create with random name
- Wait for status to show "✓ Active"
- No additional configuration needed

**Step 3: Copy Database Credentials**
```
Open the PostgreSQL database → Variables tab

You'll see:
- PGHOST: postgres-production.railway.internal
- PGPORT: 5432
- PGUSER: postgres
- PGPASSWORD: (auto-generated)
- PGDATABASE: railway
```

✅ **Result**: Database is running

---

## 🔗 Phase 3: Deploy Backend API

**Step 1: Add Backend to Project**
- In Railway project, click "New Service"
- Select "GitHub Repo"
- Connect your repository

**Step 2: Configure Backend Service**
- Select "GitHub Repo" → Your repository
- Select "Root Directory": `backend`
- Click "Deploy"

**Step 3: Set Environment Variables**
After deployment starts, go to Variables tab and add:

```
DATABASE_URL = postgresql://{PGUSER}:{PGPASSWORD}@{PGHOST}:{PGPORT}/{PGDATABASE}

SECRET_KEY = a5EJBgjas4WmTSJTZnXBnaXHMr4eXUWapJ_EmwVias4

TELEGRAM_BOT_TOKEN = (optional - leave blank if not ready)

TELEGRAM_CHAT_ID = (optional - leave blank if not ready)

CORS_ORIGINS = ["https://your-frontend-domain.com", "http://localhost:4200"]
```

Replace `{PGUSER}`, `{PGPASSWORD}`, etc. with values from PostgreSQL variables.

**Step 4: Configure Start Command**
- Go to "Deployment" tab
- Set "Procfile" or "Start Command":
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Step 5: Wait for Deployment**
- Railway automatically detects Python/requirements.txt
- Will install dependencies and start server
- Status should show "✓ Deployed"

**Step 6: Get Backend URL**
- In Railway dashboard, click the backend service
- Under "Networking", you'll see the public URL
- It looks like: `https://chickenshop-api.railway.app`
- **Save this URL** - you'll need it for frontend

✅ **Result**: Backend API is live

---

## 🎨 Phase 4: Deploy Frontend

**Step 1: Add Frontend Service**
- In Railway project, click "New Service"
- Select "GitHub Repo"
- Select your repository again

**Step 2: Configure Frontend Service**
- Select "GitHub Repo" → Your repository
- Select "Root Directory": `frontend`
- Click "Deploy"

**Step 3: Set Build Configuration**
- Go to "Deployment" tab
- Set these values:

| Setting | Value |
|---------|-------|
| Build Command | `npm run build` |
| Start Command | (leave empty for static site) |
| Publish Directory | `dist/chicken-shop-frontend/browser` |

**Step 4: Set Environment Variables**
- Go to Variables tab
- Add:
```
VITE_API_URL = https://your-backend-url.railway.app/api
```

Replace `your-backend-url` with your actual backend URL from Step 6 above.

**Step 5: Wait for Deployment**
- Railway builds your Angular app
- Deploys to CDN
- Status should show "✓ Deployed"

**Step 6: Get Frontend URL**
- Under "Networking", copy the public URL
- It looks like: `https://chickenshop-frontend.railway.app`

✅ **Result**: Frontend is live and connected to backend

---

## 🗝️ Phase 5: Create Super Admin User

**Step 1: Connect to Production Database**
```bash
# Get connection string from Railway PostgreSQL service
# In Railway, click PostgreSQL → Variables → copy PGHOST, PGPORT, etc.

psql -h your-pghost -U postgres -d railway -c "
UPDATE users SET is_superuser=TRUE, is_approved=TRUE WHERE id=1;
"
```

**Alternative: Use Railway Terminal**
1. In Railway, click PostgreSQL service
2. Click "Terminal" tab
3. Run:
```sql
UPDATE users SET is_superuser=TRUE, is_approved=TRUE WHERE id=1;
```

**Step 2: Verify Super Admin Created**
```sql
SELECT id, username, is_superuser, is_approved FROM users;
```

✅ **Result**: Super admin ready to approve users

---

## ✅ Phase 6: Test Your Deployment

### Test 1: Backend API
```bash
# Open in browser:
https://your-backend-url.railway.app/docs

# You should see Swagger UI with all endpoints
```

### Test 2: Frontend Access
```bash
# Open in browser:
https://your-frontend-url.railway.app

# You should see login page
```

### Test 3: Complete User Flow
1. **Register**: 
   - Go to frontend, click "Register"
   - Fill form (include shop name)
   - Submit

2. **Super Admin Approves**:
   - Login as admin at `/api/auth/login`
   - Call `PUT /api/auth/approve-user/2` endpoint

3. **User Login**:
   - Login with your new user account
   - Should see dashboard with shop name ✅

4. **Add Data**:
   - Add intake record (verify owner shows)
   - Add sales record (verify owner shows)
   - Add expense record (verify owner shows)

5. **Generate Report**:
   - Go to Reports section
   - Generate daily/monthly report

6. **Admin Panel**:
   - Login as super admin
   - View admin panel
   - Test user-wise filtering

✅ **Result**: Everything working in production!

---

## 🔐 Important Production Checks

- [ ] SECRET_KEY is NOT hardcoded (✅ using Railway variables)
- [ ] DATABASE_URL is from Railway PostgreSQL (✅)
- [ ] CORS origins are configured (✅)
- [ ] HTTPS enabled (✅ Railway auto-enables)
- [ ] Database backups configured (Railway auto-backs up daily)
- [ ] Environment variables are private (✅ Railway encrypts them)

---

## 📊 Monitor Your Deployment

**View Logs:**
1. In Railway, click backend/frontend service
2. Click "Logs" tab
3. See real-time logs

**View Metrics:**
1. Click service
2. Click "Metrics" tab
3. See CPU, Memory, Network usage

**Restart Service:**
1. Click service
2. Click "Settings" → "Restart"

---

## 🆘 Troubleshooting

### Issue: Backend won't start
**Solution:**
1. Check "Logs" for error messages
2. Verify DATABASE_URL is correct
3. Verify SECRET_KEY is set
4. Restart the service

### Issue: Frontend shows blank page
**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify API URL is correct in environment
4. Check network requests

### Issue: Cannot connect to backend from frontend
**Solution:**
1. Verify CORS origins include frontend URL
2. Check backend logs for CORS errors
3. Ensure backend URL in frontend is correct (no trailing slash)

### Issue: Database connection error
**Solution:**
1. Verify PostgreSQL service is "Active"
2. Check DATABASE_URL format
3. Check PGPASSWORD for special characters (if any, URL-encode them)

---

## 💾 Database Backups

**Railway automatically backs up your database daily**

To manually export data:
```bash
# Connect to Railway PostgreSQL and export
pg_dump -h your-host -U postgres -d railway > backup.sql
```

To restore:
```bash
psql -h your-host -U postgres -d railway < backup.sql
```

---

## 🎉 Success! You're Live

Your application is now live at:
- **Backend**: `https://your-backend-url.railway.app`
- **Frontend**: `https://your-frontend-url.railway.app`
- **API Docs**: `https://your-backend-url.railway.app/docs`

Share your frontend URL with your first 5 users!

---

## 📈 Next Steps (After Testing)

1. Register your first 5 users
2. Train them on the application
3. Monitor logs for any issues
4. Collect feedback
5. Plan upgrades as you grow

---

## 🚀 Ready to Scale?

When you exceed 5 users, upgrade to paid tier:
- Click project → Settings
- Upgrade to paid tier
- Same infrastructure, no code changes needed

---

**Last Updated**: May 13, 2026
**Status**: Ready to Deploy
**Estimated Time**: 20 minutes


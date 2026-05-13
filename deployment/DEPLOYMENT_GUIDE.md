# Deployment Guide

## ⭐ Quick Start: Railway Deployment (Recommended for 5 Users)

For complete step-by-step Railway deployment guide, see **[RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md)**

### Quick Summary:
- ✅ **Cost**: Free for 5 users
- ✅ **Setup Time**: ~20 minutes
- ✅ **Includes**: Backend API + Frontend + PostgreSQL Database
- ✅ **Your SECRET_KEY**: `a5EJBgjas4WmTSJTZnXBnaXHMr4eXUWapJ_EmwVias4`

**Next Steps:**
1. Go to https://railway.app
2. Sign up with GitHub
3. Follow the detailed guide in [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md)

---

## Supported Free Platforms for Up to 5 Users

### 1. Railway.app ⭐ (RECOMMENDED)
- **Pros**: Connected to GitHub, easy deployments, good free tier, includes database
- **Cons**: Limited for very heavy workloads
- **Recommended for**: Your setup (5 users)
- **Detailed Guide**: [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md)

#### Quick Setup:
1. Sign up at https://railway.app (with GitHub)
2. Create new project
3. Add PostgreSQL database (Railway → New Service → PostgreSQL)
4. Deploy backend (GitHub Repo → backend folder)
5. Deploy frontend (GitHub Repo → frontend folder)
6. Set environment variables (DATABASE_URL, SECRET_KEY, etc.)
7. Done! ✅

### 2. Render
- **Pros**: Free tier includes background workers and databases
- **Cons**: Services spin down after 15 minutes of inactivity
- **Recommended for**: Development and light production

#### Quick Setup:
1. Sign up at https://render.com
2. Click "New +" → Select service type (Web Service/PostgreSQL)
3. Connect GitHub repository
4. Configure build and start commands
5. Set environment variables

### 3. Fly.io
- **Pros**: Global deployment, good free tier
- **Cons**: Requires Docker knowledge
- **Recommended for**: Production-ready setups

#### Quick Setup:
1. Sign up at https://fly.io and install flyctl CLI
2. Run `flyctl launch` in project root
3. Configure PostgreSQL database
4. Deploy with `flyctl deploy`

## Database Setup (PostgreSQL)

### Railway PostgreSQL (Recommended)
```
1. In Railway project, click "New Service" → PostgreSQL
2. Database auto-creates
3. Copy connection string from Variables tab
4. Add DATABASE_URL to backend environment
5. Apply migrations automatically on deploy
```

### Render PostgreSQL
```
1. Create new PostgreSQL database from Render dashboard
2. Copy connection string to DATABASE_URL
3. Apply migrations using CLI
```

## Backend Deployment

### Using Railway:
```yaml
# railway.toml
[build]
builder = "dockerfile"

[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

### Using Render:
```yaml
# Create render.yaml in root
services:
  - type: web
    name: chicken-shop-api
    env: python
    buildCommand: "pip install -r backend/requirements.txt"
    startCommand: "cd backend && uvicorn app.main:app --host 0.0.0.0"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### Using Docker (for any platform):
```dockerfile
# backend/Dockerfile
FROM python:3.11.0-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend ./

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Frontend Deployment

### Static Hosting Options:
- **Vercel** (best for Angular)
- **Netlify**
- **GitHub Pages**
- **Railway Static**

### Build and Deploy:
```bash
# Build for production
npm run build

# Upload dist/chicken-shop-frontend folder to static host
```

### Environment Configuration:
Create `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-url.com/api'
};
```

## WhatsApp Integration Setup

### Using Twilio:
1. Sign up at https://www.twilio.com
2. Get a WhatsApp-enabled phone number
3. Add to environment variables:
```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
WHATSAPP_NUMBER=+recipient_number
```

## Telegram Integration Setup

### System Default Configuration:
For super admin fallback notifications, add to environment variables:
```
TELEGRAM_BOT_TOKEN=your_system_bot_token
TELEGRAM_CHAT_ID=your_system_chat_id
```

### User-Specific Configuration:
Users can configure their own Telegram settings via the profile page after registration.

### Bot Creation Steps:
1. Message @BotFather on Telegram
2. Use `/newbot` command
3. Follow prompts to create bot and get token
4. Start a chat with your bot
5. Send a message to get the chat ID (use @userinfobot or API calls)

## Domain Setup

### Free Options:
- Use platform's default domain (railway.app, render.com, fly.dev)
- Or use Freenom for free .tk/.ml domains

### Update Frontend Endpoint:
Edit `frontend/src/app/services/api.service.ts`:
```typescript
private baseUrl = 'https://your-api-domain.com/api';
```

## Maintenance & Monitoring

### Logs:
- Railway: Dashboard → Deployments → Logs
- Render: Dashboard → Services → Logs
- Fly.io: `flyctl logs`

### Database Backups:
```bash
# PostgreSQL backup
pg_dump -h host -U user -d database > backup.sql

# Restore
psql -h host -U user -d database < backup.sql
```

## Scaling for More Users

### When approaching 5-user limit:
1. Upgrade to paid tier (starts ~$5/month)
2. Consider AWS Free Tier (more complex)
3. Look into shared hosting providers

### Database Optimization:
- Add indexes for frequently queried fields
- Implement pagination for large datasets
- Cache WhatsApp notifications with background tasks
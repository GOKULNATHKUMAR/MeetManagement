# Troubleshooting Guide

## Common Issues & Solutions

### Backend Issues

#### 1. Database Connection Error
**Error**: `psycopg2.OperationalError: could not connect to server`
**Solution**:
- Ensure PostgreSQL is running: `sudo service postgresql start`
- Check DATABASE_URL in `.env` file
- Verify database exists: `createdb chicken_shop_db`
- Test connection: `psql -d chicken_shop_db`

#### 2. Import Errors
**Error**: `ModuleNotFoundError: No module named 'fastapi'`
**Solution**:
```bash
cd backend
pip install -r requirements.txt
```

#### 3. Alembic Migration Errors
**Error**: `alembic.util.exc.CommandError`
**Solution**:
```bash
cd backend
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

#### 4. CORS Errors in Browser
**Error**: `Access-Control-Allow-Origin` header missing
**Solution**: Backend is running on different port than expected. Check:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:4200`

### Frontend Issues

#### 1. Angular Build Errors
**Error**: `ng serve` fails
**Solution**:
```bash
cd frontend
npm install
npm start
```

#### 2. API Connection Errors
**Error**: `HttpErrorResponse: Unknown Error`
**Solution**:
- Check backend is running: `http://localhost:8000/docs`
- Verify API_BASE_URL in environment files
- Check CORS settings in backend

#### 3. Material Design Errors
**Error**: `mat-*` components not recognized
**Solution**:
```bash
cd frontend
npm install @angular/material @angular/cdk
```

### Authentication Issues

#### 1. Login Not Working
**Error**: Invalid credentials
**Solution**:
- Check user exists in database
- Verify password is correct
- Check if user is approved (super admin must approve new users)

#### 2. JWT Token Errors
**Error**: `401 Unauthorized`
**Solution**:
- Check SECRET_KEY in `.env`
- Verify token hasn't expired
- Ensure Bearer token format: `Authorization: Bearer <token>`

### Telegram Bot Issues

#### 1. Bot Not Responding
**Error**: Messages not being sent
**Solution**:
- Verify TELEGRAM_BOT_TOKEN in `.env`
- Check TELEGRAM_CHAT_ID is correct
- Send a message to bot first to activate chat
- Test with: `https://api.telegram.org/bot<TOKEN>/getMe`

#### 2. Invalid Token Error
**Error**: `Unauthorized`
**Solution**:
- Get new token from @BotFather
- Update `.env` file
- Restart backend server

#### 3. Wrong Chat ID
**Error**: Messages going to wrong chat
**Solution**:
- Send message to bot
- Run chat ID detection script:
```bash
cd backend
python -c "
import requests
from decouple import config
token = config('TELEGRAM_BOT_TOKEN')
url = f'https://api.telegram.org/bot{token}/getUpdates'
response = requests.get(url)
data = response.json()
for update in data.get('result', []):
    if 'message' in update:
        print(f'Chat ID: {update[\"message\"][\"chat\"][\"id\"]}')
        break
"
```

### Database Issues

#### 1. Data Not Saving
**Error**: Records not appearing in database
**Solution**:
- Check database connection
- Verify table exists: `alembic current`
- Check SQLAlchemy model definitions
- Review backend logs for errors

#### 2. Migration Conflicts
**Error**: `alembic head` conflicts
**Solution**:
```bash
cd backend
alembic downgrade base
alembic upgrade head
```

### Deployment Issues

#### 1. Railway Deployment Fails
**Error**: Build fails on Railway
**Solution**:
- Check `requirements.txt` includes all dependencies
- Ensure `Procfile` exists for Railway
- Verify environment variables are set in Railway dashboard

#### 2. Static Files Not Loading
**Error**: CSS/JS not loading in production
**Solution**:
- Run `npm run build` before deployment
- Check `dist/` folder is included
- Verify static file serving configuration

### Performance Issues

#### 1. Slow API Responses
**Solution**:
- Add database indexes on frequently queried columns
- Implement caching for reports
- Check database query optimization
- Monitor with `pg_stat_statements`

#### 2. High Memory Usage
**Solution**:
- Implement pagination for large datasets
- Use database connection pooling
- Monitor with `memory_profiler`

### Development Environment

#### 1. IDE Not Recognizing Imports
**Solution**:
- Activate virtual environment in IDE
- Install Python extension in VS Code
- Configure interpreter path

#### 2. Hot Reload Not Working
**Solution**:
- Use `--reload` flag with uvicorn
- Check file watching limits
- Restart development server

### Testing Issues

#### 1. Tests Failing
**Solution**:
- Install test dependencies: `pip install pytest`
- Set up test database
- Run with proper environment variables

### Security Issues

#### 1. Exposed Secrets
**Solution**:
- Never commit `.env` files
- Use environment variables in production
- Rotate API keys regularly
- Use HTTPS in production

#### 2. CORS Issues in Production
**Solution**:
- Configure allowed origins properly
- Use environment-specific CORS settings
- Implement proper headers

### Monitoring & Logging

#### 1. No Error Logs
**Solution**:
- Enable logging in FastAPI
- Check log levels
- Use structured logging with `structlog`

#### 2. Performance Monitoring
**Solution**:
- Add `/metrics` endpoint
- Use `prometheus_client`
- Monitor database queries

### Quick Diagnostic Commands

#### Backend Health Check
```bash
# Check if backend is running
curl http://localhost:8000/docs

# Check database connection
cd backend && python -c "from app.database import engine; print('DB OK' if engine else 'DB FAIL')"

# Check Telegram bot
cd backend && python -c "
import requests
from decouple import config
token = config('TELEGRAM_BOT_TOKEN')
response = requests.get(f'https://api.telegram.org/bot{token}/getMe')
print('Bot OK' if response.json().get('ok') else 'Bot FAIL')
"
```

#### Frontend Health Check
```bash
# Check if frontend is running
curl http://localhost:4200

# Check API connectivity
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/intake/
```

#### Database Health Check
```bash
# Check PostgreSQL
psql -d chicken_shop_db -c "SELECT version();"

# Check tables exist
psql -d chicken_shop_db -c "\dt"

# Check data
psql -d chicken_shop_db -c "SELECT COUNT(*) FROM users;"
```

### Getting Help

If you can't resolve an issue:

1. **Check Logs**: Backend logs (`uvicorn` output) and browser console
2. **Test API**: Use `/docs` endpoint to test API calls
3. **Database**: Check with `psql` or pgAdmin
4. **Environment**: Verify all `.env` variables are set
5. **Dependencies**: Reinstall with `pip install -r requirements.txt`

### Emergency Recovery

#### Reset Database
```bash
cd backend
alembic downgrade base
alembic upgrade head
```

#### Reset Environment
```bash
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Full Reset
```bash
# Stop all services
# Drop and recreate database
# Reinstall dependencies
# Run migrations
# Restart services
```

Remember: Most issues are configuration-related. Double-check your `.env` file and ensure all services are running! 🚀
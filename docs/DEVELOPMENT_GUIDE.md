# Development Setup Guide

## Quick Start (5 minutes)

### Prerequisites
- Python 3.11.0 installed
- Node.js with npm
- PostgreSQL installed and running
- Git

### Step 1: Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DATABASE_URL=postgresql://username:password@localhost/chicken_shop_db
# SECRET_KEY=your-secret-key
```

### Step 2: Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Frontend will be available at http://localhost:4200
```

### Step 3: Run Backend
```bash
# From backend directory with virtualenv activated
uvicorn app.main:app --reload

# Backend API will be at http://localhost:8000
# Interactive docs at http://localhost:8000/docs
```

## Database Setup

### Create PostgreSQL Database
```bash
# Using psql command line
psql -U postgres

# In PostgreSQL console:
CREATE DATABASE chicken_shop_db;

# Create a user (optional)
CREATE USER chicken_user WITH PASSWORD 'secure_password';
ALTER ROLE chicken_user SET client_encoding TO 'utf8';
ALTER ROLE chicken_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE chicken_user SET default_transaction_deferrable TO on;
ALTER ROLE chicken_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE chicken_shop_db TO chicken_user;
```

### Update DATABASE_URL in .env
```
DATABASE_URL=postgresql://chicken_user:secure_password@localhost/chicken_shop_db
```

### Apply Migrations
```bash
cd backend

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

## Feature Implementation Status

### 1. Authentication & Authorization ✅
**Status**: Core implementation complete, ready for testing

**Testing the Auth Flow**:
1. Register a new shop owner:
   ```bash
   curl -X POST http://localhost:8000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "owner@shop.com",
       "username": "shopowner1",
       "full_name": "Shop Owner Name",
       "password": "secure_password"
     }'
   ```

2. Login as super admin (need to manually set one in database):
   ```bash
   # First, manually update a user in database to set is_superuser=True
   # Then login:
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "password": "admin_password"
     }'
   ```

3. Approve pending shop owner:
   ```bash
   curl -X PUT http://localhost:8000/api/admin/users/2/approve \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

### 2. Chicken Intake Management ✅
**Status**: CRUD endpoints ready

**API Endpoints**:
- `POST /api/intake/` - Add new intake record
- `GET /api/intake/` - List all intakes (paginated)
- `GET /api/intake/{intake_id}` - Get specific intake
- `PUT /api/intake/{intake_id}` - Update intake
- `DELETE /api/intake/{intake_id}` - Delete intake

**Example - Add Intake**:
```bash
curl -X POST http://localhost:8000/api/intake/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 50,
    "supplier": "Fresh Farms Co",
    "cost_per_unit": 100,
    "total_cost": 5000,
    "notes": "Good quality birds"
  }'
```

### 3. Chicken Sales Management ✅
**Status**: CRUD endpoints ready

**API Endpoints**:
- `POST /api/sales/` - Record new sale
- `GET /api/sales/` - List all sales (paginated)
- `GET /api/sales/{sale_id}` - Get specific sale
- `PUT /api/sales/{sale_id}` - Update sale
- `DELETE /api/sales/{sale_id}` - Delete sale

**Example - Add Sale**:
```bash
curl -X POST http://localhost:8000/api/sales/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 25,
    "price_per_unit": 200,
    "total_revenue": 5000,
    "customer_name": "Restaurant XYZ",
    "notes": "Premium quality requested"
  }'
```

### 4. Expenses Management ✅
**Status**: CRUD endpoints ready

**API Endpoints**:
- `POST /api/expenses/` - Add expense
- `GET /api/expenses/` - List all expenses (paginated)
- `GET /api/expenses/{expense_id}` - Get specific expense
- `PUT /api/expenses/{expense_id}` - Update expense
- `DELETE /api/expenses/{expense_id}` - Delete expense

**Example - Add Expense**:
```bash
curl -X POST http://localhost:8000/api/expenses/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Feed",
    "amount": 2000,
    "description": "Chicken feed for 30 days"
  }'
```

### 5. Report Management 🔄
**Status**: Daily and Monthly reports ready, WhatsApp integration pending

**Daily Report**:
```bash
curl -X GET http://localhost:8000/api/reports/daily/2024-04-07 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Monthly Report**:
```bash
curl -X GET http://localhost:8000/api/reports/monthly/2024/4 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Monthly PDF Report**:
```bash
curl -X GET http://localhost:8000/api/reports/monthly/pdf/2024/4 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o report.pdf
```

**Send Daily Report via WhatsApp**:
```bash
# Requires Twilio configuration
curl -X POST http://localhost:8000/api/reports/daily/whatsapp/2024-04-07 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Admin Panel 🔄
**Status**: Admin endpoints ready, UI pending

**Admin Endpoints**:
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{user_id}/approve` - Approve user
- `PUT /api/admin/users/{user_id}/deactivate` - Deactivate user
- `GET /api/admin/intakes/all` - View all intakes
- `GET /api/admin/sales/all` - View all sales
- `GET /api/admin/expenses/all` - View all expenses
- `GET /api/admin/dashboard/stats` - Dashboard statistics

## Frontend Development

### Components Completed
- Login Component ✅
- Dashboard Component ✅

### Components To Implement
- Intake Management (List, Add, Edit, Delete)
- Sales Management (List, Add, Edit, Delete)
- Expenses Management (List, Add, Edit, Delete)
- Reports & Analytics
- Admin User Management
- Admin Approvals Panel

### Adding New Component

```bash
cd frontend

# Generate component (interactive)
ng generate component components/intake

# Template structure
# - intake.component.ts (logic)
# - intake.component.html (template)
# - intake.component.scss (styles)
```

## Common Issues & Solutions

### Issue: "Database connection refused"
**Solution**: 
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env
3. Verify credentials

```bash
# Test PostgreSQL connection
psql -h localhost -U chicken_user -d chicken_shop_db
```

### Issue: "CORS errors in frontend"
**Solution**: Update CORS in backend (app/main.py)
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: "Token expired"
**Solution**: Login again to get a new token

### Issue: "No module named 'pydantic'"
**Solution**: 
```bash
# Ensure virtual environment is activated
# Then reinstall requirements
pip install -r requirements.txt
```

## Testing the Workflow

### Complete User Journey:
1. **Register**: Create a new shop owner account
2. **Wait**: Super admin approves the account
3. **Login**: Shop owner logs in with credentials
4. **Add Data**: Create intake, sales, and expense records
5. **View Reports**: Generate daily/monthly reports
6. **Export**: Download PDF report
7. **Notify**: Send WhatsApp notification (with Twilio setup)

## Next Steps

### Immediate (Week 1-2):
1. [ ] Complete frontend components for all features
2. [ ] Add form validation on frontend
3. [ ] Implement error handling
4. [ ] Add loading states

### Short-term (Week 3-4):
1. [ ] Write unit tests
2. [ ] Set up CI/CD pipeline
3. [ ] Configure WhatsApp notifications
4. [ ] Optimize database queries

### Medium-term (Month 2):
1. [ ] Deploy to Railway/Render
2. [ ] Set up automated backups
3. [ ] Monitor logs and performance
4. [ ] Gather user feedback

### Long-term:
1. [ ] Mobile app improvements
2. [ ] Analytics dashboard
3. [ ] Multi-store support
4. [ ] Inventory forecasting

## Getting Help

- **API Documentation**: http://localhost:8000/docs
- **Angular Docs**: https://angular.dev
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs

## Performance Tips

### Backend:
- Use pagination for large datasets (default 100 items)
- Add database indexes for frequently filtered fields
- Cache report calculations
- Implement rate limiting for API

### Frontend:
- Lazy load route components
- Implement virtual scrolling for large lists
- Cache API responses
- Use OnPush change detection strategy

## Security Checklist

Before production deployment:
- [ ] Change SECRET_KEY to a secure random value
- [ ] Ensure HTTPS is enabled
- [ ] Set proper CORS origin URLs
- [ ] Enable CSRF protection
- [ ] Validate all user inputs
- [ ] Hash passwords (already done with passlib)
- [ ] Set up rate limiting
- [ ] Configure HTTPS redirects
- [ ] Set secure database credentials
- [ ] Enable audit logging
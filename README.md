# Chicken Shop Management System

A comprehensive web application for chicken shop owners to manage their business operations, including intake, sales, expenses, and reporting.

## Features

### 1. Super Admin Flow
- Full access to all features and data
- User management and approval system
- System-wide controls

### 2. Shop Owner Management
- Registration request system (requires super admin approval)
- Secure login and authentication
- Password reset functionality

### 3. Chicken Intake Management
- Add new chicken intake records
- View, edit, update, and delete intake entries
- Track quantities, suppliers, dates, etc.

### 4. Chicken Sales Management
- Record sales transactions
- Manage sales data with CRUD operations
- Track revenue and customer information

### 5. Other Expenses Management
- Track miscellaneous business expenses
- Full CRUD operations for expense records
- Categorize and monitor spending

### 7. Admin Panel (Super Users Only)
- **User Management**: Approve/reject new user registrations
- **System Oversight**: View all users, intakes, sales, and expenses across the system
- **Account Control**: Activate/deactivate user accounts
- **Data Monitoring**: Access to all business data for auditing purposes

## Technology Stack

- **Backend**: Python 3.11.0, FastAPI
- **Frontend**: Angular 17, npm 11.6.2
- **Database**: PostgreSQL
- **Notifications**: Telegram Bot API (completely free)
- **Deployment**: Free platform supporting up to 5 users

## Documentation

📚 **Complete Documentation Suite Available**

- **[📖 Full Documentation Index](docs/README.md)** - All guides and references
- **[🚀 Quick Start Guide](START_HERE.md)** - Get running in 5 minutes
- **[🛠️ Development Guide](docs/DEVELOPMENT_GUIDE.md)** - Complete setup instructions
- **[📡 API Reference](docs/API_REFERENCE.md)** - All endpoints with examples
- **[🐔 Telegram Setup](docs/TELEGRAM_SETUP.md)** - Free notification setup
- **[🔧 Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues & solutions
- **[🚀 Deployment Guide](deployment/DEPLOYMENT_GUIDE.md)** - Production deployment
- **[🗄️ Database Schema](docs/DATABASE_SCHEMA.md)** - Data structure & relationships

## Project Structure

```
chicken-shop-management/
├── backend/              # FastAPI backend
├── frontend/             # Angular frontend
├── docs/                 # 📚 Complete documentation suite
│   ├── README.md        # Documentation index
│   ├── API_REFERENCE.md # API endpoints
│   ├── TELEGRAM_SETUP.md # Free notifications
│   ├── TROUBLESHOOTING.md # Issue resolution
│   ├── DATABASE_SCHEMA.md # Data model
│   └── ...              # More guides
├── deployment/           # Production deployment
├── QUICK_REFERENCE.md    # Project status
├── README.md            # This file
└── START_HERE.md        # Quick start
```
├── deployment/           # Deployment guides
├── QUICK_REFERENCE.md    # Project overview
├── README.md            # This file
└── START_HERE.md        # Quick start guide
```
├── deployment/           # Deployment configurations
└── README.md            # This file
```

## Quick Setup (5 minutes)

Follow the detailed setup instructions in [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)

**Quick Commands**:
```bash
# Backend
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# Frontend  
cd frontend && npm install && npm start

# Backend (in separate terminal)
cd backend && uvicorn app.main:app --reload
```

Then:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` to view the interactive API documentation.

## Testing Status

### ✅ Completed & Tested
- Backend API framework and routing
- Database models and schema
- Authentication and authorization system
- CRUD endpoints for Intake, Sales, and Expenses
- Daily and Monthly report generation
- PDF export functionality
- Admin user management endpoints

### 🔄 In Progress
- Frontend UI components
- Frontend service integration
- WhatsApp notification integration testing
- Email notification system

### 📋 To Be Implemented
- Complete frontend components for all features
- End-to-end testing
- Performance optimization
- Mobile responsiveness refinement

## Implementation Progress

### Phase 1: Authentication & Core Setup ✅
- [x] User registration and login flow
- [x] JWT authentication
- [x] Role-based access control (Super Admin vs Shop Owner)
- [x] User approval workflow
- [x] Password reset foundation

### Phase 2: Data Management ✅
- [x] Chicken Intake Management (CRUD)
- [x] Chicken Sales Management (CRUD)
- [x] Other Expenses Management (CRUD)
- [x] Database models and schemas

### Phase 3: Reports & Notifications (Partially Completed)
- [x] Daily report generation
- [x] Monthly report generation
- [x] Monthly PDF export
- [x] WhatsApp notification integration (foundation)
- [ ] Email notifications
- [ ] Scheduled daily reports

### Phase 4: Admin Dashboard (Planned)
- [x] Admin user management
- [x] System statistics
- [ ] User approval interface
- [ ] System-wide reports

### Phase 5: Frontend Components (In Progress)
- [x] Login component
- [x] Dashboard component
- [ ] Intake management UI
- [ ] Sales management UI
- [ ] Expenses management UI
- [ ] Reports and analytics UI
- [ ] Admin panel UI
- [ ] Mobile responsiveness optimization

### Phase 6: Testing & Deployment (Planned)
- [ ] Unit tests (backend)
- [ ] Integration tests
- [ ] E2E tests (frontend)
- [ ] Performance testing
- [ ] Security audit
- [ ] Deployment to free platform

## Deployment

This application is designed to be deployed on a free platform that supports up to 5 users. Recommended platforms:
- Railway (recommended for beginners)
- Render
- Fly.io

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md)

## Features in Detail

### Super Admin Flow
The super admin has complete control over the application:
- Approve shop owner registration requests
- View all data across all shops
- Generate system-wide reports
- Manage user permissions

### Shop Owner Registration
1. Shop owners submit registration requests
2. Super admin reviews and approves requests
3. Approved owners receive login credentials
4. Owners can reset passwords if needed

### Chicken Intake Management
- **Add Intake**: Record new chicken deliveries with details like quantity, supplier, date, cost
- **List Intake**: View all intake records with filtering and sorting
- **Edit/Update**: Modify existing intake records
- **Delete**: Remove intake records (with confirmation)

### Chicken Sales Management
- **Add Sale**: Record sales transactions with customer details, quantity, price
- **List Sales**: View sales history with search and filter options
- **Edit/Update**: Modify sales records
- **Delete**: Remove sales records

### Other Expenses Management
- **Add Expense**: Record miscellaneous expenses like utilities, maintenance, supplies
- **List Expenses**: View expense history
- **Edit/Update**: Modify expense records
- **Delete**: Remove expense records

### Report Management
- **Daily Summary**: Automatic WhatsApp notifications with intake, sales, and profit/loss
- **Monthly Reports**: PDF exports with comprehensive monthly analysis
- **Manual Triggers**: Generate reports on-demand

## Mobile Responsiveness

The application is designed to be mobile-friendly, allowing shop owners to manage their business from smartphones and tablets.

## Security

- JWT-based authentication
- Role-based access control (Super Admin vs Shop Owner)
- Secure password hashing
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
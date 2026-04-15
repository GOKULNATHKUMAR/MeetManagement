# Database Schema Documentation

## Overview
The Chicken Shop Management System uses PostgreSQL with SQLAlchemy ORM. The database consists of 5 main tables with proper relationships and constraints.

## Schema Diagram

```
Users (1) ──── (Many) ChickenIntake
   │
   ├─── (Many) ChickenSale
   │
   ├─── (Many) Expense
   │
   └─── (Many) AdminActions
```

## Tables

### 1. Users Table
**Purpose**: Store user accounts and authentication data

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| full_name | VARCHAR(100) | NOT NULL | User's full name |
| hashed_password | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| is_active | BOOLEAN | DEFAULT TRUE | Account active status |
| is_superuser | BOOLEAN | DEFAULT FALSE | Super admin privileges |
| is_approved | BOOLEAN | DEFAULT FALSE | Account approval status |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes**:
- `ix_users_email` (email)
- `ix_users_username` (username)
- `ix_users_id` (id)

### 2. Chicken Intake Table
**Purpose**: Track chicken purchases and inventory intake

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Intake record ID |
| owner_id | INTEGER | FOREIGN KEY → users.id | Shop owner |
| quantity | FLOAT | NOT NULL | Quantity purchased |
| supplier | VARCHAR(100) | NOT NULL | Supplier name |
| cost_per_unit | FLOAT | NOT NULL | Cost per unit |
| total_cost | FLOAT | NOT NULL | Total purchase cost |
| intake_date | DATE | NOT NULL | Purchase date |
| notes | TEXT | NULL | Additional notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes**:
- `ix_chicken_intake_owner_id` (owner_id)
- `ix_chicken_intake_intake_date` (intake_date)
- `ix_chicken_intake_id` (id)

### 3. Chicken Sales Table
**Purpose**: Track chicken sales transactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Sale record ID |
| owner_id | INTEGER | FOREIGN KEY → users.id | Shop owner |
| quantity | FLOAT | NOT NULL | Quantity sold |
| price_per_unit | FLOAT | NOT NULL | Selling price per unit |
| total_revenue | FLOAT | NOT NULL | Total sale revenue |
| customer_name | VARCHAR(100) | NULL | Customer name |
| sale_date | DATE | NOT NULL | Sale date |
| notes | TEXT | NULL | Additional notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes**:
- `ix_chicken_sale_owner_id` (owner_id)
- `ix_chicken_sale_sale_date` (sale_date)
- `ix_chicken_sale_id` (id)

### 4. Expenses Table
**Purpose**: Track business expenses

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Expense record ID |
| owner_id | INTEGER | FOREIGN KEY → users.id | Shop owner |
| category | VARCHAR(50) | NOT NULL | Expense category |
| amount | FLOAT | NOT NULL | Expense amount |
| description | TEXT | NULL | Expense description |
| expense_date | DATE | NOT NULL | Expense date |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes**:
- `ix_expense_owner_id` (owner_id)
- `ix_expense_expense_date` (expense_date)
- `ix_expense_category` (category)
- `ix_expense_id` (id)

### 5. Admin Actions Table (Future)
**Purpose**: Track administrative actions (for future admin panel)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Action record ID |
| admin_id | INTEGER | FOREIGN KEY → users.id | Admin user |
| action_type | VARCHAR(50) | NOT NULL | Type of action |
| target_user_id | INTEGER | FOREIGN KEY → users.id | Affected user |
| details | JSON | NULL | Action details |
| created_at | TIMESTAMP | DEFAULT NOW() | Action timestamp |

## Relationships

### Foreign Key Constraints
- `chicken_intake.owner_id` → `users.id` (CASCADE)
- `chicken_sale.owner_id` → `users.id` (CASCADE)
- `expense.owner_id` → `users.id` (CASCADE)
- `admin_actions.admin_id` → `users.id` (CASCADE)
- `admin_actions.target_user_id` → `users.id` (CASCADE)

### Data Isolation
- All business data is filtered by `owner_id`
- Users can only access their own records
- Super admins can access all data

## Business Logic

### Profit/Loss Calculation
```
Profit/Loss = Total Sales Revenue - Total Intake Cost - Total Expenses
```

### Data Validation
- **Quantities**: Must be positive numbers
- **Costs/Prices**: Must be non-negative
- **Dates**: Cannot be in the future
- **Users**: Must be approved before accessing business features

## Migration History

### Initial Migration (81c56c086f7c)
- Created all 4 main tables
- Added indexes for performance
- Set up foreign key relationships

### Future Migrations
- Admin actions table
- Additional indexes for reporting
- Data archiving strategies

## Performance Considerations

### Indexes
- Date columns indexed for report filtering
- Owner ID indexed for data isolation
- Category indexed for expense grouping

### Query Optimization
- Use `owner_id` filtering in all queries
- Date range queries optimized with indexes
- Aggregation queries use indexed columns

### Data Growth
- Implement data archiving for old records
- Consider partitioning for large datasets
- Monitor query performance with `EXPLAIN ANALYZE`

## Backup Strategy

### Daily Backups
```sql
pg_dump chicken_shop_db > backup_$(date +%Y%m%d).sql
```

### Automated Backups
- Schedule daily backups
- Store in cloud storage
- Test restore procedures monthly

## Security

### Row Level Security
- All queries filtered by `owner_id`
- Users cannot access other users' data
- Super admin override for system management

### Data Encryption
- Passwords hashed with bcrypt
- Sensitive data encrypted at rest
- SSL/TLS for data in transit

## Monitoring

### Key Metrics
- Total users and active users
- Daily transaction volume
- Database size and growth
- Query performance

### Alerts
- Low disk space
- High error rates
- Unusual data patterns
- Security violations

## Development

### Local Setup
```bash
# Create database
createdb chicken_shop_db

# Run migrations
cd backend
alembic upgrade head

# Seed with test data (optional)
python scripts/seed_data.py
```

### Testing
```bash
# Run database tests
pytest tests/test_database.py

# Check schema integrity
python scripts/validate_schema.py
```

This schema provides a solid foundation for the chicken shop management system with proper data relationships, performance optimization, and security measures. 🗄️✨
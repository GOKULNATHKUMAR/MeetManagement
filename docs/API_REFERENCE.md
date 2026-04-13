# API Reference & Testing Guide

## Authentication Endpoints

### Register a New User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "password": "securepassword"
}

Response (201):
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "is_active": true,
  "is_superuser": false,
  "is_approved": false,
  "created_at": "2024-04-07T10:30:00Z",
  "updated_at": null
}
```

### Login
```
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

username=username&password=securepassword

Response (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Get Pending User Approvals (Super Admin Only)
```
GET /api/auth/pending-approvals
Authorization: Bearer {token}

Response (200):
[
  {
    "id": 2,
    "email": "owner@example.com",
    "username": "shopowner",
    "full_name": "Shop Owner",
    "is_active": true,
    "is_superuser": false,
    "is_approved": false,
    "created_at": "2024-04-07T10:30:00Z"
  }
]
```

### Approve User (Super Admin Only)
```
PUT /api/auth/approve-user/{user_id}
Authorization: Bearer {token}

Response (200):
{
  "message": "User approved successfully"
}
```

### Reject User (Super Admin Only)
```
PUT /api/auth/reject-user/{user_id}
Authorization: Bearer {token}

Response (200):
{
  "message": "User rejected and removed"
}
```

## Chicken Intake Endpoints

### Add New Intake
```
POST /api/intake/
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 50,
  "supplier": "Farm Name",
  "cost_per_unit": 100,
  "total_cost": 5000,
  "notes": "Optional note"
}

Response (201):
{
  "id": 1,
  "owner_id": 1,
  "quantity": 50,
  "supplier": "Farm Name",
  "cost_per_unit": 100,
  "total_cost": 5000,
  "intake_date": "2024-04-07T10:30:00Z",
  "notes": "Optional note",
  "created_at": "2024-04-07T10:30:00Z"
}
```

### List Intakes (with Pagination)
```
GET /api/intake/?skip=0&limit=100
Authorization: Bearer {token}

Response (200):
[
  {
    "id": 1,
    "owner_id": 1,
    "quantity": 50,
    "supplier": "Farm Name",
    "cost_per_unit": 100,
    "total_cost": 5000,
    "intake_date": "2024-04-07T10:30:00Z",
    "notes": "Optional note",
    "created_at": "2024-04-07T10:30:00Z"
  }
]
```

### Get Specific Intake
```
GET /api/intake/{intake_id}
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "owner_id": 1,
  "quantity": 50,
  "supplier": "Farm Name",
  "cost_per_unit": 100,
  "total_cost": 5000,
  "intake_date": "2024-04-07T10:30:00Z",
  "notes": "Optional note",
  "created_at": "2024-04-07T10:30:00Z"
}
```

### Update Intake
```
PUT /api/intake/{intake_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 45,
  "supplier": "Updated Farm"
}

Response (200):
{
  "id": 1,
  "owner_id": 1,
  "quantity": 45,
  "supplier": "Updated Farm",
  "cost_per_unit": 100,
  "total_cost": 4500,
  "intake_date": "2024-04-07T10:30:00Z",
  "notes": "Optional note",
  "created_at": "2024-04-07T10:30:00Z"
}
```

### Delete Intake
```
DELETE /api/intake/{intake_id}
Authorization: Bearer {token}

Response (200):
{
  "message": "Intake deleted successfully"
}
```

## Chicken Sales Endpoints

### Add New Sale
```
POST /api/sales/
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 25,
  "price_per_unit": 200,
  "total_revenue": 5000,
  "customer_name": "Customer Name",
  "notes": "Optional note"
}

Response (201):
{
  "id": 1,
  "owner_id": 1,
  "quantity": 25,
  "price_per_unit": 200,
  "total_revenue": 5000,
  "customer_name": "Customer Name",
  "sale_date": "2024-04-07T10:30:00Z",
  "notes": "Optional note",
  "created_at": "2024-04-07T10:30:00Z"
}
```

### List Sales (with Pagination)
```
GET /api/sales/?skip=0&limit=100
Authorization: Bearer {token}

Response (200):
[
  {
    "id": 1,
    "owner_id": 1,
    "quantity": 25,
    "price_per_unit": 200,
    "total_revenue": 5000,
    "customer_name": "Customer Name",
    "sale_date": "2024-04-07T10:30:00Z",
    "notes": "Optional note",
    "created_at": "2024-04-07T10:30:00Z"
  }
]
```

### Get Specific Sale
```
GET /api/sales/{sale_id}
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "owner_id": 1,
  "quantity": 25,
  "price_per_unit": 200,
  "total_revenue": 5000,
  "customer_name": "Customer Name",
  "sale_date": "2024-04-07T10:30:00Z",
  "notes": "Optional note",
  "created_at": "2024-04-07T10:30:00Z"
}
```

### Update Sale
```
PUT /api/sales/{sale_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 30,
  "price_per_unit": 250,
  "total_revenue": 7500
}

Response (200):
{
  "id": 1,
  "owner_id": 1,
  "quantity": 30,
  "price_per_unit": 250,
  "total_revenue": 7500,
  "customer_name": "Customer Name",
  "sale_date": "2024-04-07T10:30:00Z",
  "notes": "Optional note",
  "created_at": "2024-04-07T10:30:00Z"
}
```

### Delete Sale
```
DELETE /api/sales/{sale_id}
Authorization: Bearer {token}

Response (200):
{
  "message": "Sale deleted successfully"
}
```

## Expenses Endpoints

### Add New Expense
```
POST /api/expenses/
Authorization: Bearer {token}
Content-Type: application/json

{
  "category": "Feed",
  "amount": 2000,
  "description": "Chicken feed for 30 days"
}

Response (201):
{
  "id": 1,
  "owner_id": 1,
  "category": "Feed",
  "amount": 2000,
  "description": "Chicken feed for 30 days",
  "expense_date": "2024-04-07T10:30:00Z",
  "created_at": "2024-04-07T10:30:00Z"
}
```

### List Expenses (with Pagination)
```
GET /api/expenses/?skip=0&limit=100
Authorization: Bearer {token}

Response (200):
[
  {
    "id": 1,
    "owner_id": 1,
    "category": "Feed",
    "amount": 2000,
    "description": "Chicken feed for 30 days",
    "expense_date": "2024-04-07T10:30:00Z",
    "created_at": "2024-04-07T10:30:00Z"
  }
]
```

### Get Specific Expense
```
GET /api/expenses/{expense_id}
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "owner_id": 1,
  "category": "Feed",
  "amount": 2000,
  "description": "Chicken feed for 30 days",
  "expense_date": "2024-04-07T10:30:00Z",
  "created_at": "2024-04-07T10:30:00Z"
}
```

### Update Expense
```
PUT /api/expenses/{expense_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "category": "Utilities",
  "amount": 1500
}

Response (200):
{
  "id": 1,
  "owner_id": 1,
  "category": "Utilities",
  "amount": 1500,
  "description": "Chicken feed for 30 days",
  "expense_date": "2024-04-07T10:30:00Z",
  "created_at": "2024-04-07T10:30:00Z"
}
```

### Delete Expense
```
DELETE /api/expenses/{expense_id}
Authorization: Bearer {token}

Response (200):
{
  "message": "Expense deleted successfully"
}
```

## Report Endpoints

### Get Daily Report
```
GET /api/reports/daily/{date}
Authorization: Bearer {token}

Example: /api/reports/daily/2024-04-07

Response (200):
{
  "date": "2024-04-07",
  "total_intake": 5000,
  "total_sales": 5000,
  "total_expenses": 1500,
  "profit_loss": -1500
}
```

### Send Daily Report via WhatsApp
```
POST /api/reports/daily/whatsapp/{date}
Authorization: Bearer {token}

Example: /api/reports/daily/whatsapp/2024-04-07

Response (200):
{
  "message": "Daily report sent via WhatsApp"
}
```

### Get Monthly Report
```
GET /api/reports/monthly/{year}/{month}
Authorization: Bearer {token}

Example: /api/reports/monthly/2024/04

Response (200):
{
  "month": "April",
  "year": 2024,
  "total_intake": 100000,
  "total_sales": 150000,
  "total_expenses": 30000,
  "profit_loss": 20000,
  "intake_details": [
    {
      "date": "2024-04-07",
      "supplier": "Farm Name",
      "quantity": 50,
      "cost": 5000
    }
  ],
  "sales_details": [
    {
      "date": "2024-04-07",
      "customer": "Customer Name",
      "quantity": 25,
      "revenue": 5000
    }
  ],
  "expenses_details": [
    {
      "date": "2024-04-07",
      "category": "Feed",
      "amount": 2000,
      "description": "Chicken feed"
    }
  ]
}
```

### Get Monthly Report as PDF
```
GET /api/reports/monthly/pdf/{year}/{month}
Authorization: Bearer {token}

Example: /api/reports/monthly/pdf/2024/04

Response (200):
Binary PDF file with report details
```

## Admin Endpoints

### Get All Users (Super Admin Only)
```
GET /api/admin/users
Authorization: Bearer {token}

Response (200):
[
  {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "full_name": "Admin User",
    "is_active": true,
    "is_superuser": true,
    "is_approved": true,
    "created_at": "2024-04-07T10:30:00Z"
  }
]
```

### Approve User (Super Admin Only)
```
PUT /api/admin/users/{user_id}/approve
Authorization: Bearer {token}

Response (200):
{
  "message": "User approved successfully"
}
```

### Deactivate User (Super Admin Only)
```
PUT /api/admin/users/{user_id}/deactivate
Authorization: Bearer {token}

Response (200):
{
  "message": "User deactivated successfully"
}
```

### Get All Intakes (Super Admin Only)
```
GET /api/admin/intakes/all
Authorization: Bearer {token}

Response (200):
[List of all intakes from all users]
```

### Get All Sales (Super Admin Only)
```
GET /api/admin/sales/all
Authorization: Bearer {token}

Response (200):
[List of all sales from all users]
```

### Get All Expenses (Super Admin Only)
```
GET /api/admin/expenses/all
Authorization: Bearer {token}

Response (200):
[List of all expenses from all users]
```

### Get Dashboard Statistics (Super Admin Only)
```
GET /api/admin/dashboard/stats
Authorization: Bearer {token}

Response (200):
{
  "users": {
    "total": 10,
    "approved": 8,
    "pending": 2
  },
  "records": {
    "intakes": 100,
    "sales": 150,
    "expenses": 75
  }
}
```

## Error Responses

### Unauthorized (401)
```json
{
  "detail": "Could not validate credentials"
}
```

### Not Found (404)
```json
{
  "detail": "Intake not found"
}
```

### Bad Request (400)
```json
{
  "detail": "Email or username already registered"
}
```

### Forbidden (403)
```json
{
  "detail": "Not enough permissions"
}
```

## Testing with cURL

### Login and save token:
```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -d "username=admin&password=admin_password" | jq -r '.access_token')

echo $TOKEN
```

### Use token in requests:
```bash
curl -X GET http://localhost:8000/api/intake/ \
  -H "Authorization: Bearer $TOKEN"
```

## Testing with Postman

1. Import API endpoints from `http://localhost:8000/docs`
2. Create environment variables for `base_url` and `token`
3. Use `{{ base_url }}` and `{{ token }}` in requests
4. Setup pre-request script to refresh token if needed
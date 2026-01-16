# MediTrack API Documentation

## Base URL
- Backend: `http://localhost:8080`
- AI Module: `http://localhost:5000`

## Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Register User
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+977-1-1234567",
  "role": "SUPPLIER",
  "organizationName": "ABC Pharmaceuticals",
  "licenseNumber": "SUP-001",
  "address": "Kathmandu, Nepal"
}

Response:
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  ...
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "SUPPLIER",
    ...
  }
}
```

### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  ...
}
```

### Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

Body:
{
  "email": "john@example.com"
}
```

## Admin Endpoints

### Dashboard
```
GET /api/admin/dashboard
Authorization: Bearer <token>

Response:
{
  "stats": {
    "totalMedicines": 100,
    "totalSuppliers": 10,
    "totalPharmacies": 20,
    "lowStockMedicines": 5,
    "nearExpiryMedicines": 3
  },
  "recentActivities": [...],
  "topMedicines": [...]
}
```

### Get All Medicines
```
GET /api/admin/medicines?page=0&size=10&search=paracetamol&category=PAINKILLER&status=AVAILABLE
Authorization: Bearer <token>

Query Parameters:
- page: Page number (default: 0)
- size: Page size (default: 10)
- search: Search term
- category: ANTIBIOTIC, PAINKILLER, VITAMIN, etc.
- status: AVAILABLE, LOW_STOCK, OUT_OF_STOCK
- supplierId: Filter by supplier ID

Response:
{
  "content": [...],
  "totalPages": 10,
  "totalElements": 100,
  ...
}
```

### Get Medicine by ID
```
GET /api/admin/medicines/{id}
Authorization: Bearer <token>
```

### Create Medicine
```
POST /api/admin/medicines
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "Paracetamol 500mg",
  "category": "PAINKILLER",
  "genericName": "Paracetamol",
  "manufacturer": "ABC Pharma",
  "description": "Pain relief medicine",
  "unitPrice": 50.00,
  "currentStock": 1000,
  "minStockLevel": 100,
  "expiryDate": "2025-12-31",
  "batchNumber": "BATCH-001",
  "supplierId": 1
}
```

### Update Medicine
```
PUT /api/admin/medicines/{id}
Authorization: Bearer <token>
Content-Type: application/json

Body: (same as create)
```

### Delete Medicine
```
DELETE /api/admin/medicines/{id}
Authorization: Bearer <token>
```

### Export Medicines
```
GET /api/admin/medicines/export?format=csv
GET /api/admin/medicines/export?format=pdf
Authorization: Bearer <token>

Response: File download
```

### User Management

#### Get All Users
```
GET /api/admin/users?page=0&size=10&role=SUPPLIER&search=john
Authorization: Bearer <token>
```

#### Get User by ID
```
GET /api/admin/users/{id}
Authorization: Bearer <token>
```

#### Update User
```
PUT /api/admin/users/{id}
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  ...
}
```

#### Activate User
```
PUT /api/admin/users/{id}/activate
Authorization: Bearer <token>
```

#### Deactivate User
```
PUT /api/admin/users/{id}/deactivate
Authorization: Bearer <token>
```

#### Delete User
```
DELETE /api/admin/users/{id}
Authorization: Bearer <token>
```

#### Get Users by Role
```
GET /api/admin/users/roles/{role}
Authorization: Bearer <token>

Roles: ADMIN, SUPPLIER, PHARMACY
```

### Reports

#### Stock Summary
```
GET /api/admin/reports/stock-summary
Authorization: Bearer <token>
```

#### Expiry Report
```
GET /api/admin/reports/expiry-report?days=30
Authorization: Bearer <token>
```

#### Category Distribution
```
GET /api/admin/reports/category-distribution
Authorization: Bearer <token>
```

#### Supplier Summary
```
GET /api/admin/reports/supplier-summary
Authorization: Bearer <token>
```

#### Low Stock Report
```
GET /api/admin/reports/low-stock-report
Authorization: Bearer <token>
```

### Activity Logs

#### Get All Activities
```
GET /api/admin/activities?page=0&size=20
Authorization: Bearer <token>
```

#### Get User Activities
```
GET /api/admin/activities/user/{userId}?page=0&size=20
Authorization: Bearer <token>
```

#### Get Entity Activities
```
GET /api/admin/activities/entity/{entityType}/{entityId}?page=0&size=20
Authorization: Bearer <token>
```

#### Get Activities by Date Range
```
GET /api/admin/activities/date-range?startDate=2024-01-01T00:00:00&endDate=2024-01-31T23:59:59
Authorization: Bearer <token>
```

## Supplier Endpoints

### Dashboard
```
GET /api/supplier/dashboard
Authorization: Bearer <token>

Response:
{
  "stats": {
    "totalMedicines": 50,
    "lowStockMedicines": 2,
    "nearExpiryMedicines": 1,
    "totalStockValue": 500000.00
  }
}
```

### Get Own Medicines
```
GET /api/supplier/medicines?search=paracetamol&category=PAINKILLER&status=AVAILABLE
Authorization: Bearer <token>
```

### Create Medicine
```
POST /api/supplier/medicines
Authorization: Bearer <token>
Content-Type: application/json

Body: (same as admin create medicine, supplierId is auto-filled)
```

### Update Medicine
```
PUT /api/supplier/medicines/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete Medicine
```
DELETE /api/supplier/medicines/{id}
Authorization: Bearer <token>
```

## Pharmacy Endpoints

### Dashboard
```
GET /api/pharmacy/dashboard
Authorization: Bearer <token>

Response:
{
  "stats": {
    "availableMedicines": 100,
    "myOrders": 10,
    "pendingOrders": 2
  }
}
```

### Browse Medicines
```
GET /api/pharmacy/medicines?page=0&size=20&search=paracetamol&category=PAINKILLER
Authorization: Bearer <token>
```

### Get Medicine Details
```
GET /api/pharmacy/medicines/{id}
Authorization: Bearer <token>
```

## AI Module Endpoints

### Health Check
```
GET http://localhost:5000/health

Response:
{
  "status": "healthy",
  "service": "MediTrack AI Module"
}
```

### Train Forecasting Model
```
POST http://localhost:5000/api/forecast/train
Content-Type: application/json

Body:
{
  "historical_data": [
    {
      "date": "2024-01-01",
      "demand": 100,
      "current_stock": 500
    },
    ...
  ]
}
```

### Predict Demand
```
POST http://localhost:5000/api/forecast/predict
Content-Type: application/json

Body:
{
  "month": 1,
  "day_of_week": 1,
  "current_stock": 500
}

Response:
{
  "predicted_demand": 120
}
```

### Expiry Alerts
```
POST http://localhost:5000/api/analytics/expiry-alerts
Content-Type: application/json

Body:
{
  "medicines": [
    {
      "id": 1,
      "name": "Paracetamol",
      "expiryDate": "2024-02-01",
      "currentStock": 100
    },
    ...
  ]
}
```

### Stock Recommendations
```
POST http://localhost:5000/api/analytics/stock-recommendations
Content-Type: application/json

Body:
{
  "medicines": [...],
  "usage_history": [...]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Email is required"
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "An unexpected error occurred"
}
```

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Notes

- All dates are in ISO 8601 format (YYYY-MM-DD)
- All timestamps are in ISO 8601 format with timezone
- Prices are in Nepalese Rupees (Rs.)
- Pagination is 0-indexed
- JWT tokens expire after 24 hours (configurable)




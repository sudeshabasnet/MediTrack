# MediTrack API Inventory

## Authentication APIs (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)
- `POST /api/auth/forgot-password` - Forgot password (TODO)

## Admin APIs (`/api/admin`)
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/medicines` - List all medicines (with filters)
- `GET /api/admin/medicines/{id}` - Get medicine by ID
- `POST /api/admin/medicines` - Create medicine
- `PUT /api/admin/medicines/{id}` - Update medicine
- `DELETE /api/admin/medicines/{id}` - Delete medicine
- `GET /api/admin/medicines/export` - Export medicines (CSV/PDF)

## User Management APIs (`/api/admin/users`)
- `GET /api/admin/users` - List all users (with filters)
- `GET /api/admin/users/{id}` - Get user by ID
- `PUT /api/admin/users/{id}` - Update user
- `PUT /api/admin/users/{id}/activate` - Activate user
- `PUT /api/admin/users/{id}/deactivate` - Deactivate user
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/users/roles/{role}` - Get users by role

## Supplier APIs (`/api/supplier`)
- `GET /api/supplier/dashboard` - Get supplier dashboard stats
- `GET /api/supplier/medicines` - List supplier's medicines
- `GET /api/supplier/medicines/{id}` - Get medicine by ID
- `POST /api/supplier/medicines` - Create medicine
- `PUT /api/supplier/medicines/{id}` - Update medicine
- `DELETE /api/supplier/medicines/{id}` - Delete medicine

## Pharmacy APIs (`/api/pharmacy`)
- `GET /api/pharmacy/dashboard` - Get pharmacy dashboard stats
- `GET /api/pharmacy/medicines` - Browse available medicines
- `GET /api/pharmacy/medicines/{id}` - Get medicine details

## Cart APIs (`/api/cart`)
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item quantity
- `DELETE /api/cart/{id}` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart
- `GET /api/cart/summary` - Get cart summary (count, total)

## Order APIs (`/api/orders`)
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/status` - Update order status (Admin only)

## Payment APIs (`/api/payment`)
- `POST /api/payment/esewa` - Initiate eSewa payment
- `GET /api/payment/success` - Payment success callback
- `GET /api/payment/failure` - Payment failure callback

## Review APIs (`/api/reviews`)
- `GET /api/reviews/medicine/{medicineId}` - Get medicine reviews
- `POST /api/reviews` - Create/update review
- `DELETE /api/reviews/{id}` - Delete review
- `GET /api/reviews/medicine/{medicineId}/average` - Get average rating

## Report APIs (`/api/reports`)
- `GET /api/reports/stock-summary` - Stock summary report
- `GET /api/reports/expiry-report` - Expiry report
- `GET /api/reports/category-distribution` - Category distribution
- `GET /api/reports/supplier-summary` - Supplier summary
- `GET /api/reports/low-stock-report` - Low stock report

## Activity Log APIs (`/api/activity-logs`)
- `GET /api/activity-logs` - Get all activity logs
- `GET /api/activity-logs/user/{userId}` - Get user activity logs
- `GET /api/activity-logs/entity/{entityType}/{entityId}` - Get entity activity logs
- `GET /api/activity-logs/date-range` - Get logs by date range



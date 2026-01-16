# TestSprite Configuration for MediTrack

## Application Information

### Frontend
- **URL**: `http://localhost:3000`
- **Framework**: React 18 with Vite
- **Technology**: Single Page Application (SPA)

### Backend API
- **Base URL**: `http://localhost:8081`
- **API Prefix**: `/api`
- **Framework**: Spring Boot 3.2.0
- **Authentication**: JWT Bearer Token

## Test Environment Setup

### Prerequisites
1. Backend running on port 8081
2. Frontend running on port 3000
3. MySQL database running with `meditrack` database
4. TestSprite account (sign up at https://www.testsprite.com/)

## Application URLs

### Public Pages
- Landing Page: `http://localhost:3000/`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Forgot Password: `http://localhost:3000/forgot-password`

### Protected Pages (Require Authentication)
- Admin Dashboard: `http://localhost:3000/admin/dashboard`
- User Dashboard: `http://localhost:3000/user/dashboard`
- Cart: `http://localhost:3000/user/cart`
- Checkout: `http://localhost:3000/user/checkout`
- Pharmacy Dashboard: `http://localhost:3000/pharmacy/dashboard`
- Supplier Dashboard: `http://localhost:3000/supplier/dashboard`

## Test User Credentials

### Admin User
- Email: `admin@test.com`
- Password: `admin123`
- Role: `ADMIN`

### General User
- Email: `user@test.com`
- Password: `user123`
- Role: `USER`

### Supplier
- Email: `supplier@test.com`
- Password: `supplier123`
- Role: `SUPPLIER`

### Pharmacy
- Email: `pharmacy@test.com`
- Password: `pharmacy123`
- Role: `PHARMACY`

## API Endpoints for Testing

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Cart Management
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/{id}` - Update cart item quantity
- `DELETE /api/cart/{id}` - Remove from cart
- `GET /api/cart/summary` - Get cart summary

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details

### Payment
- `POST /api/payment/esewa` - Initiate eSewa payment

### Reviews
- `GET /api/reviews/medicine/{id}` - Get medicine reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/medicine/{id}/average` - Get average rating

### Medicines (Public)
- `GET /api/pharmacy/medicines` - Browse medicines
- `GET /api/pharmacy/medicines/{id}` - Get medicine details

## Test Scenarios

### 1. User Registration Tests
- **Test Case 1.1**: Register as General User (USER role)
  - Verify organization name and license number fields are hidden
  - Verify registration succeeds with only required fields
  - Verify auto-generated organization name and license number

- **Test Case 1.2**: Register as Supplier
  - Verify all fields are visible and required
  - Verify registration succeeds with all fields

- **Test Case 1.3**: Register as Pharmacy
  - Verify all fields are visible and required
  - Verify registration succeeds with all fields

- **Test Case 1.4**: Registration Validation
  - Test duplicate email registration
  - Test invalid email format
  - Test password mismatch
  - Test missing required fields

### 2. Authentication Tests
- **Test Case 2.1**: Successful Login
  - Login with valid credentials
  - Verify JWT token is received
  - Verify redirect to appropriate dashboard based on role

- **Test Case 2.2**: Failed Login
  - Test with invalid email
  - Test with invalid password
  - Verify error messages are displayed

- **Test Case 2.3**: Protected Routes
  - Verify unauthenticated users are redirected to login
  - Verify role-based access control

### 3. Cart Management Tests
- **Test Case 3.1**: Add to Cart
  - Add medicine to cart
  - Verify item appears in cart
  - Verify quantity updates correctly

- **Test Case 3.2**: Update Cart Quantity
  - Increase quantity
  - Decrease quantity
  - Remove item (quantity = 0)

- **Test Case 3.3**: Cart Summary
  - Verify total amount calculation
  - Verify item count
  - Verify cart persists across sessions

### 4. Order Placement Tests
- **Test Case 4.1**: Create Order
  - Add items to cart
  - Navigate to checkout
  - Fill shipping information
  - Select payment method
  - Place order
  - Verify order is created
  - Verify cart is cleared

- **Test Case 4.2**: eSewa Payment Flow
  - Select eSewa payment method
  - Verify payment form is generated
  - Verify redirect to eSewa (in test mode)

### 5. Review System Tests
- **Test Case 5.1**: Submit Review
  - Select rating (1-5 stars)
  - Add comment
  - Submit review
  - Verify review appears

- **Test Case 5.2**: View Reviews
  - View medicine reviews
  - Verify average rating calculation
  - Verify review count

### 6. Medicine Browsing Tests
- **Test Case 6.1**: Search Medicines
  - Search by name
  - Search by category
  - Verify search results

- **Test Case 6.2**: Filter Medicines
  - Filter by category
  - Filter by status
  - Verify filter results

### 7. User Dashboard Tests
- **Test Case 7.1**: Dashboard Statistics
  - Verify cart item count
  - Verify order count
  - Verify cart total

- **Test Case 7.2**: Navigation
  - Verify all navigation links work
  - Verify role-based navigation

## TestSprite Configuration Steps

### Step 1: Create Project in TestSprite
1. Log in to TestSprite Web Portal
2. Create a new project named "MediTrack"
3. Set application type to "Web Application"

### Step 2: Configure Application URLs
- **Frontend URL**: `http://localhost:3000`
- **Backend API URL**: `http://localhost:8081`
- **Base URL**: `http://localhost:3000`

### Step 3: Authentication Setup
- **Authentication Type**: JWT Bearer Token
- **Login Endpoint**: `POST /api/auth/login`
- **Login Payload**: 
  ```json
  {
    "email": "user@test.com",
    "password": "user123"
  }
  ```
- **Token Location**: Response body field `token`
- **Token Header**: `Authorization: Bearer {token}`

### Step 4: Define Test Scenarios
Use the test scenarios listed above to create test cases in TestSprite.

### Step 5: Run Tests
1. Ensure both frontend and backend are running
2. Execute test suite from TestSprite dashboard
3. Monitor test execution in real-time
4. Review test reports

## Test Data Setup

### Pre-test Database Setup
```sql
-- Ensure test users exist (or create via registration)
-- Test users should be created before running tests
```

### Test Medicines
- Create test medicines via Admin dashboard or API
- Ensure at least 5-10 test medicines exist
- Include medicines in different categories

## Expected Test Results

### Success Criteria
- All authentication tests pass
- All cart management tests pass
- All order placement tests pass
- All review system tests pass
- All navigation tests pass
- No critical bugs found

### Known Issues to Test
- Verify USER role registration hides organization/license fields
- Verify eSewa payment integration works
- Verify cart persists across page refreshes
- Verify role-based access control

## Continuous Testing

### Recommended Test Schedule
- Run full test suite before each deployment
- Run smoke tests after each code change
- Run regression tests weekly

## Troubleshooting

### Common Issues
1. **Backend not running**: Ensure Spring Boot is running on port 8081
2. **Frontend not running**: Ensure Vite dev server is running on port 3000
3. **Database connection**: Verify MySQL is running and database exists
4. **CORS errors**: Verify CORS configuration in SecurityConfig
5. **Authentication failures**: Check JWT token expiration and secret key

## Additional Resources

- TestSprite Documentation: https://docs.testsprite.com/
- TestSprite Web Portal: https://www.testsprite.com/
- API Documentation: See `API_DOCUMENTATION.md`
- Project README: See `README.md`




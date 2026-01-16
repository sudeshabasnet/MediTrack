# TestSprite Setup Guide for MediTrack

## Quick Start

### 1. Prerequisites
- TestSprite account (sign up at https://www.testsprite.com/)
- Backend running on `http://localhost:8081`
- Frontend running on `http://localhost:3000`
- MySQL database with `meditrack` database

### 2. Start the Application

```bash
# Terminal 1: Start Backend
cd backend
mvn spring-boot:run

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

### 3. Create Test Users (if not already created)

You can create test users via the registration page or use these existing test credentials:

- **Admin**: admin@test.com / admin123
- **User**: user@test.com / user123
- **Supplier**: supplier@test.com / supplier123
- **Pharmacy**: pharmacy@test.com / pharmacy123

### 4. TestSprite Configuration

#### Step 1: Create Project
1. Log in to TestSprite Web Portal
2. Click "Create New Project"
3. Enter project name: **MediTrack**
4. Select project type: **Web Application**

#### Step 2: Configure Application
1. **Frontend URL**: `http://localhost:3000`
2. **Backend API URL**: `http://localhost:8081`
3. **Application Type**: Single Page Application (SPA)

#### Step 3: Set Up Authentication
1. Go to Authentication Settings
2. Select **JWT Bearer Token**
3. Configure login:
   - **Endpoint**: `POST /api/auth/login`
   - **Request Body**:
     ```json
     {
       "email": "user@test.com",
       "password": "user123"
     }
     ```
   - **Token Location**: Response body → `token`
   - **Header Format**: `Authorization: Bearer {token}`

#### Step 4: Import Test Plan
1. Go to Test Cases section
2. Click "Import Test Plan"
3. Upload `testsprite-test-plan.json` file
4. Review and customize test cases

#### Step 5: Run Tests
1. Ensure application is running
2. Click "Run Test Suite"
3. Monitor test execution in real-time
4. Review test reports

## Test Execution Checklist

Before running tests, verify:

- [ ] Backend is running on port 8081
- [ ] Frontend is running on port 3000
- [ ] Database is accessible
- [ ] Test users exist in database
- [ ] At least 5-10 test medicines exist
- [ ] CORS is properly configured
- [ ] JWT authentication is working

## Key Test Scenarios

### Critical Paths to Test

1. **User Registration Flow**
   - General User (fields hidden)
   - Supplier/Pharmacy (all fields visible)

2. **Authentication Flow**
   - Login with different roles
   - Role-based redirects
   - Protected route access

3. **E-commerce Flow**
   - Browse medicines
   - Add to cart
   - Update cart
   - Checkout
   - Place order
   - Payment integration

4. **Review System**
   - Submit review
   - View reviews
   - Average rating calculation

## Troubleshooting

### Issue: Tests fail with "Connection refused"
**Solution**: Ensure backend and frontend are running

### Issue: Authentication fails
**Solution**: 
- Check JWT token expiration
- Verify login credentials
- Check CORS configuration

### Issue: Cart operations fail
**Solution**:
- Verify user is logged in
- Check cart API endpoints
- Verify JWT token is included in requests

### Issue: Payment tests fail
**Solution**:
- eSewa is in test mode (EPAYTEST)
- Verify payment controller is accessible
- Check eSewa configuration in application.properties

## Test Reports

After test execution, TestSprite will generate:
- Test execution summary
- Pass/fail statistics
- Error logs and screenshots
- Performance metrics
- Recommendations for fixes

## Next Steps

1. Review test reports
2. Fix any identified issues
3. Re-run failed tests
4. Update test cases as needed
5. Set up continuous testing

## Support

- TestSprite Documentation: https://docs.testsprite.com/
- TestSprite Support: support@testsprite.com
- Project Documentation: See `README.md` and `API_DOCUMENTATION.md`




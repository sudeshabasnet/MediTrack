# TestSprite Testing Guide for MediTrack

## 📚 Documentation Files

This directory contains all the necessary files to test MediTrack with TestSprite:

1. **TESTSPRITE_QUICK_START.md** - ⚡ Quick 5-minute setup guide
2. **TESTSPRITE_SETUP.md** - 📖 Detailed step-by-step setup instructions
3. **TESTSPRITE_CONFIG.md** - ⚙️ Complete configuration reference
4. **testsprite-test-plan.json** - 📋 Test plan to import into TestSprite
5. **start-test-environment.sh** - 🚀 Script to start test environment

## 🎯 What is TestSprite?

TestSprite is an AI-powered autonomous testing agent that can:
- Automatically generate test cases
- Execute end-to-end tests
- Test API endpoints
- Test user interfaces
- Generate comprehensive test reports
- Identify bugs and suggest fixes

## ✅ Current Status

**Application Status:**
- ✅ Backend: Running on http://localhost:8081
- ✅ Frontend: Running on http://localhost:3000
- ✅ Database: MySQL with `meditrack` database
- ✅ Authentication: JWT working correctly

**Test Users Available:**
- ✅ Admin: admin@test.com / admin123
- ✅ User: user@test.com / user123 (create if needed)
- ✅ Supplier: supplier@test.com / supplier123 (create if needed)
- ✅ Pharmacy: pharmacy@test.com / pharmacy123 (create if needed)

## 🚀 Quick Start

### Option 1: Use the Quick Start Guide
```bash
# Read the quick start guide
cat TESTSPRITE_QUICK_START.md
```

### Option 2: Follow These Steps

1. **Start Application** (if not running):
   ```bash
   ./start-test-environment.sh
   ```

2. **Sign Up for TestSprite**:
   - Visit: https://www.testsprite.com/
   - Create a free account

3. **Create Project in TestSprite**:
   - Project Name: `MediTrack`
   - Application Type: Web Application
   - Frontend URL: `http://localhost:3000`
   - Backend URL: `http://localhost:8081`

4. **Configure Authentication**:
   - Type: JWT Bearer Token
   - Login Endpoint: `POST /api/auth/login`
   - Request Body:
     ```json
     {
       "email": "user@test.com",
       "password": "user123"
     }
     ```
   - Token Location: Response body → `token`
   - Header: `Authorization: Bearer {token}`

5. **Import Test Plan**:
   - In TestSprite dashboard, go to "Test Cases"
   - Click "Import"
   - Upload `testsprite-test-plan.json`

6. **Run Tests**:
   - Click "Run Test Suite"
   - Monitor execution
   - Review reports

## 📋 Test Coverage

### Authentication & Authorization
- ✅ User registration (all roles)
- ✅ User login
- ✅ Role-based access control
- ✅ Protected routes

### E-commerce Features
- ✅ Browse medicines
- ✅ Search & filter
- ✅ Add to cart
- ✅ Update cart
- ✅ Remove from cart
- ✅ Checkout process
- ✅ Order placement
- ✅ eSewa payment integration

### Review System
- ✅ Submit reviews
- ✅ View reviews
- ✅ Average rating calculation
- ✅ Review management

### User Management
- ✅ User dashboard
- ✅ Order history
- ✅ Cart management

## 🔧 Configuration Details

### Application URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081/api
- **Base URL**: http://localhost:3000

### API Endpoints
All endpoints are documented in:
- `API_DOCUMENTATION.md` - Complete API reference
- `testsprite-test-plan.json` - Test plan with endpoints

### Authentication Flow
1. POST `/api/auth/login` with credentials
2. Receive JWT token in response
3. Include token in Authorization header: `Bearer {token}`
4. Token valid for 24 hours

## 📊 Test Scenarios Included

The test plan includes 15 comprehensive test scenarios:

1. User Registration - General User (fields hidden)
2. User Registration - Supplier/Pharmacy
3. User Login & Authentication
4. Add to Cart
5. Update Cart Quantity
6. Place Order
7. eSewa Payment Integration
8. Submit Review
9. View Reviews
10. Search Medicines
11. Filter Medicines
12. User Dashboard
13. Protected Routes
14. Cart Persistence
15. Order History

## 🐛 Troubleshooting

### Services Not Running
```bash
# Check backend
curl http://localhost:8081

# Check frontend
curl http://localhost:3000

# Start services
./start-test-environment.sh
```

### Authentication Issues
- Verify JWT token is being sent in headers
- Check token expiration (24 hours)
- Ensure user exists in database
- Verify password is correct

### CORS Errors
- Check `SecurityConfig.java`
- Verify `cors.allowed-origins=http://localhost:3000`
- Ensure CORS is enabled for all endpoints

### Database Issues
- Verify MySQL is running
- Check database connection in `application.properties`
- Ensure `meditrack` database exists

## 📈 Expected Results

After running tests, you should see:
- ✅ All critical paths passing
- ✅ Authentication working
- ✅ Cart functionality working
- ✅ Order placement working
- ✅ Review system working
- ⚠️ Any issues will be reported with details

## 🎓 Learning Resources

- **TestSprite Docs**: https://docs.testsprite.com/
- **TestSprite Portal**: https://www.testsprite.com/
- **Project API Docs**: `API_DOCUMENTATION.md`
- **Project README**: `README.md`

## 📝 Notes

- TestSprite requires both frontend and backend to be running
- Tests run against the local development environment
- eSewa payment tests use test mode (EPAYTEST)
- All test users should be created before running tests
- Test data (medicines) should exist in the database

## 🆘 Need Help?

1. Check `TESTSPRITE_QUICK_START.md` for quick answers
2. Review `TESTSPRITE_SETUP.md` for detailed instructions
3. Check `TESTSPRITE_CONFIG.md` for configuration details
4. Review TestSprite documentation
5. Check application logs for errors

---

**Ready to test?** Start with `TESTSPRITE_QUICK_START.md` for the fastest setup!




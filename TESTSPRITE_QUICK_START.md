# TestSprite Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Start Your Application
```bash
# Run the test environment script
./start-test-environment.sh

# OR manually:
# Terminal 1 - Backend
cd backend && mvn spring-boot:run

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Step 2: Verify Services
- ✅ Backend: http://localhost:8081
- ✅ Frontend: http://localhost:3000
- ✅ Database: MySQL running

### Step 3: TestSprite Portal Setup

1. **Sign Up/Login**: Go to https://www.testsprite.com/
2. **Create Project**: 
   - Name: `MediTrack`
   - Type: Web Application
3. **Configure URLs**:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8081`
4. **Set Authentication**:
   - Type: JWT Bearer Token
   - Login: `POST /api/auth/login`
   - Body: `{"email": "user@test.com", "password": "user123"}`
   - Token: Response → `token`
   - Header: `Authorization: Bearer {token}`

### Step 4: Import Test Plan
- Upload `testsprite-test-plan.json` from project root
- Review test cases
- Customize as needed

### Step 5: Run Tests
- Click "Run Test Suite"
- Monitor execution
- Review reports

## 📋 Test Credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Admin | admin@test.com | admin123 | /admin/dashboard |
| User | user@test.com | user123 | /user/dashboard |
| Supplier | supplier@test.com | supplier123 | /supplier/dashboard |
| Pharmacy | pharmacy@test.com | pharmacy123 | /pharmacy/dashboard |

## 🎯 Key Test Scenarios

1. ✅ User Registration (USER role - fields hidden)
2. ✅ Login & Authentication
3. ✅ Add to Cart
4. ✅ Update Cart
5. ✅ Place Order
6. ✅ eSewa Payment
7. ✅ Submit Review
8. ✅ View Reviews
9. ✅ Search & Filter Medicines
10. ✅ Role-based Access Control

## 📁 Configuration Files

- `TESTSPRITE_CONFIG.md` - Detailed configuration
- `TESTSPRITE_SETUP.md` - Step-by-step setup
- `testsprite-test-plan.json` - Test plan (import to TestSprite)
- `start-test-environment.sh` - Start services script

## 🔍 Quick Verification

Test these URLs manually before running TestSprite:

```bash
# Test Backend
curl http://localhost:8081/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}'

# Test Frontend
curl http://localhost:3000
```

## ⚠️ Common Issues

**Backend not responding?**
```bash
cd backend && mvn spring-boot:run
```

**Frontend not responding?**
```bash
cd frontend && npm run dev
```

**CORS errors?**
- Check `SecurityConfig.java` CORS settings
- Verify `cors.allowed-origins` in `application.properties`

**Authentication fails?**
- Verify JWT secret key
- Check token expiration (86400000ms = 24 hours)
- Ensure user exists in database

## 📊 Expected Test Results

- **Total Test Cases**: 15
- **Critical Paths**: 5
- **API Endpoints**: 20+
- **User Roles**: 4 (ADMIN, USER, SUPPLIER, PHARMACY)

## 🎓 Next Steps

1. Run initial test suite
2. Review test reports
3. Fix any issues found
4. Re-run tests
5. Set up continuous testing

For detailed information, see:
- `TESTSPRITE_CONFIG.md` - Full configuration details
- `TESTSPRITE_SETUP.md` - Detailed setup instructions
- `API_DOCUMENTATION.md` - API reference




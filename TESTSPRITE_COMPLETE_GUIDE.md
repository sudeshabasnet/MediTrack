# Complete TestSprite Guide for MediTrack

## 🎉 Everything is Ready!

Your MediTrack project is fully configured for testing with TestSprite using both:
1. ✅ **TestSprite MCP** (via Cursor)
2. ✅ **TestSprite Web Portal** (via browser)

## 📋 Configuration Summary

### ✅ MCP Configuration
- **Status**: Configured in `~/.cursor/mcp.json`
- **API Key**: Set
- **Server**: TestSprite MCP
- **Config File**: `testsprite-mcp-config.json`

### ✅ Application Status
- **Backend**: ✅ Running on http://localhost:8081
- **Frontend**: ✅ Running on http://localhost:3000
- **Database**: ✅ MySQL with `meditrack` database

### ✅ Test Users
- **Admin**: admin@test.com / admin123
- **User**: user@test.com / user123
- **Supplier**: supplier@test.com / supplier123
- **Pharmacy**: pharmacy@test.com / pharmacy123

### ✅ Configuration Files
- `testsprite-mcp-config.json` - MCP configuration
- `testsprite-test-plan.json` - Test plan (15 scenarios)
- All documentation files ready

## 🚀 Method 1: Using TestSprite MCP (Recommended)

### Step 1: Verify MCP Connection
Your MCP is already configured. You can now use TestSprite MCP tools directly in Cursor.

### Step 2: Create Test Project via MCP
Use MCP tools to:
1. Create a new test project named "MediTrack"
2. Configure application URLs:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8081

### Step 3: Configure Authentication via MCP
Set up JWT authentication:
- Type: JWT Bearer Token
- Login: POST /api/auth/login
- Payload: `{"email": "user@test.com", "password": "user123"}`
- Token: response.token
- Header: Authorization: Bearer {token}

### Step 4: Import Test Plan
Import `testsprite-test-plan.json` or use MCP to generate test plan from your configuration.

### Step 5: Execute Tests
Run tests via MCP tools and get results programmatically.

## 🌐 Method 2: Using TestSprite Web Portal

### Step 1: Access Portal
1. Go to https://www.testsprite.com/
2. Log in with your account

### Step 2: Create Project
1. Click "Create New Project"
2. Name: **MediTrack**
3. Type: **Web Application**

### Step 3: Configure Application
```
Frontend URL: http://localhost:3000
Backend URL: http://localhost:8081
Base URL: http://localhost:3000
```

### Step 4: Set Up Authentication
1. Go to Authentication Settings
2. Select **JWT Bearer Token**
3. Configure:
   - Endpoint: `POST /api/auth/login`
   - Body: `{"email": "user@test.com", "password": "user123"}`
   - Token: `response.token`
   - Header: `Authorization: Bearer {token}`

### Step 5: Import Test Plan
1. Go to "Test Cases"
2. Click "Import"
3. Upload `testsprite-test-plan.json`

### Step 6: Run Tests
1. Click "Run Test Suite"
2. Monitor execution
3. Review reports

## 📊 Test Plan Overview

### 15 Test Scenarios Included:

**Authentication (3)**
1. User Registration - General User (fields hidden)
2. User Registration - Supplier/Pharmacy
3. User Login & Authentication

**E-commerce (4)**
4. Add to Cart
5. Update Cart Quantity
6. Place Order
7. eSewa Payment Integration

**Reviews (2)**
8. Submit Review
9. View Reviews

**Navigation (3)**
10. Search Medicines
11. Filter Medicines
12. User Dashboard

**Security (3)**
13. Protected Routes
14. Cart Persistence
15. Order History

## 🔧 Quick Reference

### Application URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8081/api
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register

### Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| User | user@test.com | user123 |
| Supplier | supplier@test.com | supplier123 |
| Pharmacy | pharmacy@test.com | pharmacy123 |

### Key API Endpoints
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `POST /api/orders` - Place order
- `POST /api/payment/esewa` - eSewa payment
- `POST /api/reviews` - Submit review

## 🛠️ Utility Scripts

### Start Services
```bash
./start-test-environment.sh
```

### Create Test Users
```bash
./create-test-users.sh
```

### Test API Endpoints
```bash
./test-api-endpoints.sh
```

### Check Status
```bash
./test-with-testsprite.sh
```

## 📁 All Files Created

### Configuration Files
- ✅ `testsprite-mcp-config.json` - MCP configuration
- ✅ `testsprite-test-plan.json` - Test plan JSON
- ✅ `TESTSPRITE_MCP_SETUP.md` - MCP setup guide
- ✅ `TESTSPRITE_MCP_USAGE.md` - MCP usage guide

### Documentation Files
- ✅ `TESTSPRITE_README.md` - Main guide
- ✅ `TESTSPRITE_QUICK_START.md` - Quick start
- ✅ `TESTSPRITE_SETUP.md` - Detailed setup
- ✅ `TESTSPRITE_CONFIG.md` - Full configuration
- ✅ `TESTSPRITE_TEST_CHECKLIST.md` - Test checklist
- ✅ `TESTSPRITE_READY.md` - Ready status
- ✅ `test-sprite-manual-tests.md` - Manual tests

### Utility Scripts
- ✅ `start-test-environment.sh` - Start services
- ✅ `create-test-users.sh` - Create users
- ✅ `test-api-endpoints.sh` - Test APIs
- ✅ `test-with-testsprite.sh` - Status check

## ✅ Pre-Flight Checklist

Before running tests:
- [x] MCP configured in mcp.json
- [x] API key set
- [x] Backend running
- [x] Frontend running
- [x] Test users created
- [x] Configuration files ready
- [x] Test plan prepared

## 🎯 Recommended Workflow

1. **Verify Everything**
   ```bash
   ./test-with-testsprite.sh
   ```

2. **Choose Method**
   - Option A: Use TestSprite MCP tools in Cursor
   - Option B: Use TestSprite Web Portal

3. **Create Project**
   - Name: MediTrack
   - Configure URLs and authentication

4. **Import Test Plan**
   - Upload `testsprite-test-plan.json`

5. **Run Tests**
   - Execute test suite
   - Monitor progress

6. **Review Results**
   - Analyze test reports
   - Fix any issues
   - Re-run if needed

## 🎓 Documentation Guide

**New to TestSprite?**
→ Start with `TESTSPRITE_QUICK_START.md`

**Using MCP?**
→ Read `TESTSPRITE_MCP_USAGE.md`

**Need detailed setup?**
→ Check `TESTSPRITE_SETUP.md`

**Ready to test?**
→ Use `TESTSPRITE_TEST_CHECKLIST.md`

## 🆘 Troubleshooting

### MCP Not Working?
- Verify API key in `~/.cursor/mcp.json`
- Restart Cursor
- Check MCP server logs

### Services Not Running?
```bash
./start-test-environment.sh
```

### Test Users Missing?
```bash
./create-test-users.sh
```

### API Endpoints Failing?
```bash
./test-api-endpoints.sh
```

## 🎉 You're All Set!

Everything is configured and ready. You can now:

1. ✅ Use TestSprite MCP tools in Cursor
2. ✅ Or use TestSprite Web Portal
3. ✅ Run comprehensive tests
4. ✅ Get detailed reports
5. ✅ Fix issues and improve quality

**Choose your preferred method and start testing! 🚀**

---

**Status**: ✅ Fully Configured and Ready
**MCP**: ✅ Configured
**Web Portal**: ✅ Ready
**Test Plan**: ✅ 15 Scenarios
**Services**: ✅ Running



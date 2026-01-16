# TestSprite Test Execution Checklist

## ✅ Pre-Test Verification

### Environment Setup
- [ ] Backend running on http://localhost:8081
- [ ] Frontend running on http://localhost:3000
- [ ] MySQL database running
- [ ] Database `meditrack` exists
- [ ] Test users created (run `./create-test-users.sh`)

### Test Users Created
- [ ] Admin: admin@test.com / admin123
- [ ] User: user@test.com / user123
- [ ] Supplier: supplier@test.com / supplier123
- [ ] Pharmacy: pharmacy@test.com / pharmacy123

### API Endpoints Verified
- [ ] Registration endpoint working
- [ ] Login endpoint working
- [ ] Profile endpoint working
- [ ] Cart endpoints working
- [ ] Order endpoints working
- [ ] Payment endpoint working
- [ ] Review endpoints working

## 📋 TestSprite Portal Setup

### Project Configuration
- [ ] TestSprite account created
- [ ] Project "MediTrack" created
- [ ] Frontend URL configured: http://localhost:3000
- [ ] Backend URL configured: http://localhost:8081

### Authentication Configuration
- [ ] Authentication type: JWT Bearer Token
- [ ] Login endpoint: POST /api/auth/login
- [ ] Login payload configured correctly
- [ ] Token extraction path: response.token
- [ ] Header format: Authorization: Bearer {token}

### Test Plan Import
- [ ] Test plan imported from `testsprite-test-plan.json`
- [ ] All 15 test scenarios visible
- [ ] Test cases reviewed and customized

## 🧪 Test Execution

### Authentication Tests
- [ ] TC-001: User Registration - General User (fields hidden)
- [ ] TC-002: User Registration - Supplier
- [ ] TC-003: User Login & Authentication

### E-commerce Tests
- [ ] TC-004: Add to Cart
- [ ] TC-005: Update Cart Quantity
- [ ] TC-006: Place Order
- [ ] TC-007: eSewa Payment Integration

### Review System Tests
- [ ] TC-008: Submit Review
- [ ] TC-009: View Reviews

### Navigation Tests
- [ ] TC-010: Search Medicines
- [ ] TC-011: Filter Medicines
- [ ] TC-012: User Dashboard

### Security Tests
- [ ] TC-013: Protected Routes
- [ ] TC-014: Cart Persistence
- [ ] TC-015: Order History

## 📊 Test Results Review

### Pass Criteria
- [ ] All critical paths passing
- [ ] Authentication working correctly
- [ ] Cart functionality working
- [ ] Order placement working
- [ ] Payment integration working
- [ ] Review system working
- [ ] Role-based access control working

### Issues Found
- [ ] List any bugs found
- [ ] List any performance issues
- [ ] List any UI/UX issues
- [ ] List any API issues

## 🔧 Post-Test Actions

### Fix Issues
- [ ] Review test reports
- [ ] Fix critical bugs
- [ ] Fix high-priority bugs
- [ ] Fix medium-priority bugs
- [ ] Document low-priority issues

### Re-test
- [ ] Re-run failed tests
- [ ] Verify fixes work
- [ ] Run regression tests
- [ ] Update test cases if needed

## 📝 Test Report Summary

### Test Statistics
- Total Test Cases: 15
- Passed: ___
- Failed: ___
- Skipped: ___
- Pass Rate: ___%

### Critical Issues
1. 
2. 
3. 

### Recommendations
1. 
2. 
3. 

## 🎯 Next Steps

- [ ] Share test results with team
- [ ] Prioritize bug fixes
- [ ] Schedule retest
- [ ] Update documentation
- [ ] Set up continuous testing

---

**Test Date**: _______________
**Tested By**: _______________
**Test Environment**: Local Development
**TestSprite Version**: _______________



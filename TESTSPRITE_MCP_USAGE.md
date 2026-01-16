# TestSprite MCP Usage Guide

## 🎯 Quick Start with TestSprite MCP

Your TestSprite MCP server is configured and ready to use!

## 📋 Current Configuration

### MCP Server Setup
- **Server**: TestSprite
- **Package**: @testsprite/testsprite-mcp@latest
- **API Key**: Configured in mcp.json
- **Status**: ✅ Ready

### Project Configuration
- **Config File**: `testsprite-mcp-config.json`
- **Test Plan**: `testsprite-test-plan.json`
- **Status**: ✅ Ready

## 🚀 How to Use TestSprite MCP

### Method 1: Direct MCP Tool Calls

You can now use TestSprite MCP tools directly in Cursor. The MCP server provides tools for:

1. **Project Management**
   - Create test projects
   - Configure applications
   - Set up authentication

2. **Test Planning**
   - Generate test plans
   - Create test cases
   - Define test scenarios

3. **Test Execution**
   - Run test suites
   - Execute individual tests
   - Monitor test progress

4. **Results & Reports**
   - Get test results
   - View test reports
   - Analyze failures

### Method 2: Web Portal (Alternative)

If you prefer the web interface:
1. Go to https://www.testsprite.com/
2. Use the configuration files we created
3. Import `testsprite-test-plan.json`

## 📝 Project Details for MCP

When using MCP tools, you'll need:

### Application Information
```json
{
  "frontendUrl": "http://localhost:3000",
  "backendUrl": "http://localhost:8081",
  "baseUrl": "http://localhost:3000"
}
```

### Authentication Configuration
```json
{
  "type": "jwt",
  "loginEndpoint": "/api/auth/login",
  "loginMethod": "POST",
  "loginPayload": {
    "email": "user@test.com",
    "password": "user123"
  },
  "tokenPath": "token",
  "headerName": "Authorization",
  "headerFormat": "Bearer {token}"
}
```

### Test Users
All test users are ready:
- Admin: admin@test.com / admin123
- User: user@test.com / user123
- Supplier: supplier@test.com / supplier123
- Pharmacy: pharmacy@test.com / pharmacy123

## 🔧 MCP Tool Examples

### Example 1: Create Project
```javascript
// MCP tool call (example)
create_project({
  name: "MediTrack",
  frontendUrl: "http://localhost:3000",
  backendUrl: "http://localhost:8081"
})
```

### Example 2: Configure Authentication
```javascript
configure_authentication({
  type: "jwt",
  loginEndpoint: "/api/auth/login",
  tokenPath: "token"
})
```

### Example 3: Generate Test Plan
```javascript
generate_test_plan({
  projectId: "your-project-id",
  includeScenarios: [
    "user-registration",
    "authentication",
    "cart-management",
    "order-placement",
    "payment-integration",
    "review-system"
  ]
})
```

## ✅ Pre-Flight Checklist

Before using MCP tools, ensure:

- [x] MCP server configured in mcp.json
- [x] API key is valid
- [x] Backend running on port 8081
- [x] Frontend running on port 3000
- [x] Test users created
- [x] Configuration files ready

## 🎯 Recommended Workflow

1. **Verify Services**
   ```bash
   ./test-api-endpoints.sh
   ```

2. **Use MCP Tools**
   - Create project via MCP
   - Configure authentication
   - Generate/import test plan
   - Execute tests

3. **Review Results**
   - Get test reports via MCP
   - Analyze failures
   - Fix issues
   - Re-run tests

## 📊 Test Coverage

Your test plan includes:
- ✅ 15 test scenarios
- ✅ 4 user roles
- ✅ 20+ API endpoints
- ✅ Complete e-commerce flow
- ✅ Payment integration
- ✅ Review system

## 🆘 Troubleshooting MCP

### Issue: MCP server not responding
**Solution**: 
- Verify API key is correct
- Check MCP server is running
- Restart Cursor if needed

### Issue: Cannot connect to application
**Solution**:
- Ensure backend is running: `cd backend && mvn spring-boot:run`
- Ensure frontend is running: `cd frontend && npm run dev`
- Verify URLs in configuration

### Issue: Authentication fails
**Solution**:
- Verify test users exist: `./create-test-users.sh`
- Check JWT token format
- Verify login endpoint works

## 📚 Additional Resources

- **MCP Config**: `testsprite-mcp-config.json`
- **Test Plan**: `testsprite-test-plan.json`
- **Quick Start**: `TESTSPRITE_QUICK_START.md`
- **Full Setup**: `TESTSPRITE_SETUP.md`
- **TestSprite Docs**: https://docs.testsprite.com/

## 🎉 You're Ready!

Your TestSprite MCP is configured and ready to use. You can now:
1. Use MCP tools directly in Cursor
2. Create and run tests programmatically
3. Get automated test results
4. Integrate testing into your workflow

**Happy Testing! 🚀**



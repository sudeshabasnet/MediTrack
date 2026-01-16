# TestSprite MCP Configuration Guide

## ✅ MCP Configuration Status

Your TestSprite MCP server is configured in `~/.cursor/mcp.json` with:
- ✅ Server: TestSprite
- ✅ Command: npx @testsprite/testsprite-mcp@latest
- ✅ API Key: Configured

## 🚀 Using TestSprite MCP

The TestSprite MCP server allows you to:
- Create test projects programmatically
- Generate test plans automatically
- Execute tests via MCP
- Get test results and reports

## 📋 Project Configuration

Your MediTrack project configuration is ready in:
- `testsprite-mcp-config.json` - Complete project configuration
- `testsprite-test-plan.json` - Test plan for import

## 🔧 MCP Configuration Details

### Current Setup
```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Project Details for MCP
- **Project Name**: MediTrack
- **Frontend URL**: http://localhost:3000
- **Backend URL**: http://localhost:8081
- **Authentication**: JWT Bearer Token

## 🎯 Next Steps with MCP

### Option 1: Use MCP Tools Directly
The TestSprite MCP server provides tools that can be called directly. You can:
1. Create a test project
2. Configure authentication
3. Generate test plans
4. Execute tests
5. Get results

### Option 2: Use TestSprite Web Portal
1. Go to https://www.testsprite.com/
2. Log in with your account
3. Create project manually
4. Import `testsprite-test-plan.json`

## 📝 Configuration Files Reference

### For MCP Usage
- `testsprite-mcp-config.json` - MCP-compatible configuration
- `testsprite-test-plan.json` - Test plan JSON

### For Manual Setup
- `TESTSPRITE_QUICK_START.md` - Quick setup guide
- `TESTSPRITE_SETUP.md` - Detailed setup
- `TESTSPRITE_CONFIG.md` - Full configuration

## 🔍 Verifying MCP Connection

To verify your MCP server is working:
1. Check if MCP resources are available
2. Test MCP tool calls
3. Verify API key is valid

## 🎓 Using MCP Tools

The TestSprite MCP server typically provides tools like:
- `create_project` - Create a new test project
- `configure_authentication` - Set up authentication
- `generate_test_plan` - Auto-generate test cases
- `execute_tests` - Run test suite
- `get_results` - Retrieve test results

## ⚙️ Environment Variables

Your MCP configuration uses:
- `API_KEY`: Your TestSprite API key (already configured)

## 📊 Project Information for MCP

When using MCP tools, provide:
- **Application URLs**: 
  - Frontend: http://localhost:3000
  - Backend: http://localhost:8081
- **Authentication**:
  - Type: JWT
  - Login: POST /api/auth/login
  - Token: response.token
- **Test Users**: See `testsprite-mcp-config.json`

## 🚀 Ready to Test

Your project is configured for both:
1. ✅ **MCP Integration** - Use MCP tools directly
2. ✅ **Web Portal** - Use TestSprite web interface

Both methods will work with your current setup!



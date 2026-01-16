
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** MediTrack
- **Date:** 2025-12-29
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** General User Registration Success
- **Test Code:** [TC001_General_User_Registration_Success.py](./TC001_General_User_Registration_Success.py)
- **Test Error:** The general user registration form was filled and submitted twice with valid data, but no confirmation or success message appeared. Subsequent login attempt with the registered credentials failed, with the login form resetting without any success or error message. This indicates a failure in the registration or login process. The issue has been reported. Task is stopped.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Please verify your email before logging in (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/6648d7e2-427d-4655-9364-a4d8d8f1f6ba
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** Pharmacy Registration with License Details
- **Test Code:** [TC002_Pharmacy_Registration_with_License_Details.py](./TC002_Pharmacy_Registration_with_License_Details.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/3afc0bdb-03d9-408b-ba50-b6a052e0bdd4
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** Registration Failure on Missing Required Fields
- **Test Code:** [TC003_Registration_Failure_on_Missing_Required_Fields.py](./TC003_Registration_Failure_on_Missing_Required_Fields.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/ee7a926a-4a33-46ec-af06-c23130ab0740
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** Successful Login and JWT Token Issued
- **Test Code:** [TC004_Successful_Login_and_JWT_Token_Issued.py](./TC004_Successful_Login_and_JWT_Token_Issued.py)
- **Test Error:** The task to verify that users can log in with valid credentials and receive a JWT token for authentication is not fully completed. Initial login attempts with valid credentials failed due to 'User not found' error. Multiple attempts to register a new user were blocked by form validation errors and input issues on required fields, preventing user creation. Therefore, login and JWT token verification could not be performed. Further investigation or fixing of user registration and login functionality is needed to complete this task successfully.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/c23e9c63-0ce5-48ef-911e-24cf46d85d68
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** Login Failure with Invalid Credentials
- **Test Code:** [TC005_Login_Failure_with_Invalid_Credentials.py](./TC005_Login_Failure_with_Invalid_Credentials.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/0964f97f-e0aa-46bf-a103-2b0b794e8d9f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** Role-Based Dashboard Access After Login
- **Test Code:** [TC006_Role_Based_Dashboard_Access_After_Login.py](./TC006_Role_Based_Dashboard_Access_After_Login.py)
- **Test Error:** Unable to proceed with login tests due to lack of valid credentials for Admin, User, Supplier, and Pharmacy roles. Please provide valid credentials for these roles to verify that after login users are redirected to their specific dashboards based on their role.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/4e77298a-f33f-4720-9bd2-950cdaf02b9c
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** Unauthorized Dashboard Access Is Prevented
- **Test Code:** [TC007_Unauthorized_Dashboard_Access_Is_Prevented.py](./TC007_Unauthorized_Dashboard_Access_Is_Prevented.py)
- **Test Error:** Unable to proceed with access control testing due to lack of valid user credentials. Login attempts with general user and admin credentials failed with 'User not found' error. Please provide valid credentials to continue testing access restrictions and verify that users cannot access unauthorized dashboards or functionalities.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/98237b8a-d86f-4200-81e4-3b073bebd868
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** Admin Creates a New Medicine Item
- **Test Code:** [TC008_Admin_Creates_a_New_Medicine_Item.py](./TC008_Admin_Creates_a_New_Medicine_Item.py)
- **Test Error:** Admin login blocked due to unverified email. Cannot proceed to medicine management page to create new medicine. Please verify admin email to continue testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/a7b8d70c-301b-4d5d-87eb-2920933952b6
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** Supplier Updates Existing Medicine Stock
- **Test Code:** [TC009_Supplier_Updates_Existing_Medicine_Stock.py](./TC009_Supplier_Updates_Existing_Medicine_Stock.py)
- **Test Error:** Supplier login failed repeatedly with 'User not found' error despite password reset attempts. Unable to verify stock update functionality as supplier cannot access the system. Task cannot proceed further without valid supplier login.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/d8a2dc04-19d2-4746-8f52-bd867a4cb490
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** Invalid Medicine Data Handling on Create/Update
- **Test Code:** [TC010_Invalid_Medicine_Data_Handling_on_CreateUpdate.py](./TC010_Invalid_Medicine_Data_Handling_on_CreateUpdate.py)
- **Test Error:** Unable to proceed with the task as the registration form resets after submission without success or error messages. This prevents creating an admin user to test medicine creation or update validation. Please fix the registration functionality to continue testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/945e0d01-1c88-4ec8-a77b-bec0f57f0de6
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011
- **Test Name:** User Adds Medicine to Cart
- **Test Code:** [TC011_User_Adds_Medicine_to_Cart.py](./TC011_User_Adds_Medicine_to_Cart.py)
- **Test Error:** Login attempts with valid credentials failed repeatedly. Unable to login as general user. Cannot proceed with adding medicine items to cart or verifying cart updates. Reporting the issue and stopping further testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/api/auth/register:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/632b0095-826d-4bcb-90a8-be31328f6a5d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012
- **Test Name:** User Updates Medicine Quantity in Cart
- **Test Code:** [TC012_User_Updates_Medicine_Quantity_in_Cart.py](./TC012_User_Updates_Medicine_Quantity_in_Cart.py)
- **Test Error:** Login attempts with valid credentials repeatedly fail, returning to login page with empty fields. Unable to access user cart page to test quantity update and cart total update. Reporting this issue and stopping further testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/api/auth/register:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Please verify your email before logging in (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/dc78adfa-60c5-41b1-b0be-19ebc7e6f18b
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013
- **Test Name:** User Places Order Successfully
- **Test Code:** [TC013_User_Places_Order_Successfully.py](./TC013_User_Places_Order_Successfully.py)
- **Test Error:** Testing stopped due to unexpected redirection from homepage to registration page when trying to add medicines to cart. The core functionality to add items to cart and proceed to checkout cannot be tested until this issue is resolved.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/5bd66cfe-9e50-41cc-9408-fa69ed2b2a36
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014
- **Test Name:** Order History Displays Past Orders
- **Test Code:** [TC014_Order_History_Displays_Past_Orders.py](./TC014_Order_History_Displays_Past_Orders.py)
- **Test Error:** Unable to complete the task to verify order history due to registration form issue preventing new user creation. Existing user login failed and no valid user credentials available. Recommend providing valid test user credentials or fixing registration issue to proceed.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/api/auth/register:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/26e69963-c8e8-47f8-baf5-b2861ba7832e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015
- **Test Name:** Order Placement Failure on Insufficient Stock
- **Test Code:** [TC015_Order_Placement_Failure_on_Insufficient_Stock.py](./TC015_Order_Placement_Failure_on_Insufficient_Stock.py)
- **Test Error:** Login functionality is broken: the login form does not submit or retains empty fields after clicking login or show password button. This prevents accessing the user account and testing order placement with quantity exceeding stock. Further testing cannot proceed until this issue is fixed.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Please verify your email before logging in (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[ERROR] Failed to load resource: the server responded with a status of 401 (Unauthorized) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Please verify your email before logging in (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/fbc4d16c-65e8-4340-bc14-139b5b975853
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016
- **Test Name:** Successful Payment Processing via eSewa
- **Test Code:** [TC016_Successful_Payment_Processing_via_eSewa.py](./TC016_Successful_Payment_Processing_via_eSewa.py)
- **Test Error:** Registration form submission fails repeatedly despite valid inputs and agreeing to terms. Unable to create user account to proceed with payment testing. Reporting this issue and stopping further actions.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 (Bad Request) (at http://localhost:3000/api/auth/register:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/b1b3f2d6-b227-417e-b0ca-6c14e8d7b889
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017
- **Test Name:** Payment Failure Handling from eSewa
- **Test Code:** [TC017_Payment_Failure_Handling_from_eSewa.py](./TC017_Payment_Failure_Handling_from_eSewa.py)
- **Test Error:** Testing stopped due to inability to click the login button on the login page, preventing login and further progress. Issue reported for resolution.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/eaac70c8-8835-4632-9a55-2c569c4df2bc
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018
- **Test Name:** User Submits Medicine Review and Rating
- **Test Code:** [TC018_User_Submits_Medicine_Review_and_Rating.py](./TC018_User_Submits_Medicine_Review_and_Rating.py)
- **Test Error:** Login attempts failed with valid credentials. Cannot proceed to test review submission as logged-in user. Reporting issue and stopping further testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/5defe25b-a3b9-46fc-b6ce-2edf36db3f53
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019
- **Test Name:** Review and Rating Display Accuracy
- **Test Code:** [TC019_Review_and_Rating_Display_Accuracy.py](./TC019_Review_and_Rating_Display_Accuracy.py)
- **Test Error:** The task to verify that reviews and ratings submitted are accurately displayed on medicine pages and aggregated properly could not be completed. Attempts to access medicine details with existing reviews were blocked by registration and login failures. The registration form repeatedly showed validation errors despite filling all fields, and login attempts failed due to user not found. No medicine details or review pages were accessed or verified. Further debugging or access to a valid user account is needed to complete this task.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/638bb01d-478e-4e90-84af-ddd21e5dde99
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020
- **Test Name:** Prevent Review Submission Without Authentication
- **Test Code:** [TC020_Prevent_Review_Submission_Without_Authentication.py](./TC020_Prevent_Review_Submission_Without_Authentication.py)
- **Test Error:** Test stopped because navigation to the medicine page failed. Unable to verify if unauthenticated users are blocked from submitting reviews or prompted to log in. Please fix navigation issues and retry.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/9665451c-9575-4d54-89d6-8cac877cd691
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021
- **Test Name:** End-to-End Registration and Login Flow via Web Frontend
- **Test Code:** [TC021_End_to_End_Registration_and_Login_Flow_via_Web_Frontend.py](./TC021_End_to_End_Registration_and_Login_Flow_via_Web_Frontend.py)
- **Test Error:** The end-to-end testing of the registration and login flow on the localhost web frontend was attempted for the General User role. Multiple attempts to register a user with valid data failed due to persistent issues with inputting the Address field and password fields, and no success message or redirection to the login page was observed. Validation errors such as 'Passwords do not match' and browser-required field warnings blocked form submission. Due to these issues, the registration and login flows for all roles could not be fully verified. Further investigation and fixes are needed in the frontend form handling and validation feedback to complete the testing successfully.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/5e0ea12c-98f1-454f-91f3-5b7f8da77c5d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022
- **Test Name:** Access Protected Routes Without JWT Token
- **Test Code:** [TC022_Access_Protected_Routes_Without_JWT_Token.py](./TC022_Access_Protected_Routes_Without_JWT_Token.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/bc661cf4-0a9e-47b4-b3f0-2aa53648852a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC023
- **Test Name:** Medicine Deletion by Admin
- **Test Code:** [TC023_Medicine_Deletion_by_Admin.py](./TC023_Medicine_Deletion_by_Admin.py)
- **Test Error:** Unable to proceed with the task to verify admin medicine deletion because no valid admin or user credentials are available for login. The system returns 'User not found' for all tested credentials, and the registration form does not allow creating an admin account. Manual intervention or backend setup is required to create an admin account to continue testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/b081a61f-13bd-46fe-8700-4e8b61df9935
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC024
- **Test Name:** Cart Behaves Correctly on Medicine Deletion
- **Test Code:** [TC024_Cart_Behaves_Correctly_on_Medicine_Deletion.py](./TC024_Cart_Behaves_Correctly_on_Medicine_Deletion.py)
- **Test Error:** Login functionality is broken as the login form clears inputs without error or navigation on login attempt. This prevents proceeding with the test to add medicine to cart and verify cart updates. Reporting this issue and stopping further testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80:0:0)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (at http://localhost:3000/api/auth/login:0:0)
[ERROR] Login error: AxiosError (at http://localhost:3000/src/contexts/AuthContext.jsx:80:14)
[ERROR] Login failed: Login failed: User not found (at http://localhost:3000/src/pages/public/LoginPage.jsx:67:16)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=3e936705:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/4cefb6fc-fc0c-43d7-b8a9-62101b145379/04351b76-68a8-4010-a6ca-85b59ea0ef01
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **16.67** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---
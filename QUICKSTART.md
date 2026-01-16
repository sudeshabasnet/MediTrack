# MediTrack Quick Start Guide

## Prerequisites Checklist

- [ ] Java 17+ installed
- [ ] Maven 3.8+ installed
- [ ] Node.js 18+ and npm installed
- [ ] MySQL 8.0+ installed and running
- [ ] Python 3.9+ installed (for AI module)

## Step-by-Step Setup

### 1. Database Setup (5 minutes)

```bash
# Start MySQL (if not running)
sudo systemctl start mysql  # Linux
# or
brew services start mysql   # macOS

# Create database
mysql -u root -p
CREATE DATABASE meditrack;
exit;
```

### 2. Backend Setup (10 minutes)

```bash
cd backend

# Edit database credentials in application.properties
# File: src/main/resources/application.properties
# Update: spring.datasource.username and spring.datasource.password

# Build and run
mvn clean install
mvn spring-boot:run
```

✅ Backend should be running on `http://localhost:8080`

### 3. Create Admin User (2 minutes)

```bash
# Option 1: Using API (after backend is running)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@meditrack.com",
    "password": "admin123",
    "phoneNumber": "+977-1-1234567",
    "role": "ADMIN",
    "organizationName": "MediTrack",
    "licenseNumber": "ADMIN-001",
    "address": "Kathmandu, Nepal"
  }'

# Then update role to ADMIN in database
mysql -u root -p meditrack
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@meditrack.com';
exit;
```

### 4. Frontend Setup (5 minutes)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend should be running on `http://localhost:3000`

### 5. AI Module Setup (Optional, 3 minutes)

```bash
cd ai-module

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask app
python app.py
```

✅ AI Module should be running on `http://localhost:5000`

## Testing the Setup

### 1. Test Backend

```bash
# Health check (should return 404 or 401, which is expected)
curl http://localhost:8080/api/auth/profile

# Register a test user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@test.com",
    "password": "test123",
    "phoneNumber": "+977-1-9999999",
    "role": "SUPPLIER",
    "organizationName": "Test Org",
    "licenseNumber": "TEST-001",
    "address": "Test Address"
  }'
```

### 2. Test Frontend

1. Open browser: `http://localhost:3000`
2. You should see the landing page
3. Click "Register" and create an account
4. Login with your credentials

### 3. Test AI Module

```bash
# Health check
curl http://localhost:5000/health

# Should return: {"status": "healthy", "service": "MediTrack AI Module"}
```

## Default Login Credentials

After setting up admin user:
- **Email**: admin@meditrack.com
- **Password**: admin123

⚠️ **Change this password in production!**

## Common Issues

### Issue: Backend won't start
- **Check**: MySQL is running
- **Check**: Database credentials in application.properties
- **Check**: Port 8080 is not in use

### Issue: Frontend can't connect to backend
- **Check**: Backend is running on port 8080
- **Check**: CORS configuration in SecurityConfig.java
- **Check**: Browser console for errors

### Issue: Database connection error
- **Check**: MySQL is running
- **Check**: Database 'meditrack' exists
- **Check**: Username/password in application.properties

### Issue: JWT token errors
- **Check**: jwt.secret in application.properties
- **Check**: Token is being sent in Authorization header

## Next Steps

1. ✅ Verify all services are running
2. ✅ Login as admin
3. ✅ Add some medicines
4. ✅ Explore the dashboard
5. ✅ Test search and filter features
6. ✅ Integrate AI module for forecasting

## Development Tips

- Use browser DevTools to debug frontend
- Check backend logs in console
- Use Postman/curl for API testing
- Enable SQL logging in application.properties for debugging

## Production Deployment

Before deploying to production:

1. Change JWT secret to a strong random key
2. Update CORS origins to your domain
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Set up proper database backups
6. Configure production database credentials
7. Set up monitoring and logging
8. Review security settings

## Support

For issues:
1. Check the logs
2. Review the README.md
3. Check common issues above
4. Contact the development team

Happy coding! 🚀


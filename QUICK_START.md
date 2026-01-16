# Quick Start Guide - MediTrack

## Prerequisites
- ✅ MySQL running on localhost:3306
- ✅ Java 17+ installed
- ✅ Maven 3.8+ installed
- ✅ Node.js 18+ and npm installed

## Step-by-Step Instructions

### 1. Start MySQL Database
Make sure MySQL is running:
```bash
# Check if MySQL is running
sudo systemctl status mysql
# OR
mysql -u root -p
```

### 2. Start Backend (Spring Boot)

Open a **Terminal/Command Prompt** and run:

```bash
# Navigate to backend directory
cd backend

# Build and run the Spring Boot application
mvn spring-boot:run
```

**Backend will start on:** `http://localhost:8081`

**What happens:**
- ✅ Database tables are created automatically
- ✅ Seed data (20 medicines) is added automatically if database is empty
- ✅ Admin user is created (if using init.sql)
- ✅ API is ready at `http://localhost:8081/api`

**Wait for this message:**
```
Started MediTrackApplication in X.XXX seconds
```

---

### 3. Start Frontend (React + Vite)

Open a **NEW Terminal/Command Prompt** (keep backend running) and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (only first time)
npm install

# Start development server
npm run dev
```

**Frontend will start on:** `http://localhost:3000`

**What happens:**
- ✅ Vite dev server starts
- ✅ Frontend is accessible at `http://localhost:3000`
- ✅ Hot reload is enabled (changes reflect automatically)

**Wait for this message:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## Quick Commands Summary

### Backend
```bash
cd backend
mvn spring-boot:run
```
**Port:** 8081  
**URL:** http://localhost:8081

### Frontend
```bash
cd frontend
npm install    # First time only
npm run dev
```
**Port:** 3000  
**URL:** http://localhost:3000

---

## Verify Everything is Running

1. **Backend Check:**
   - Open browser: http://localhost:8081/api/auth/profile
   - Should see JSON response (may require authentication)

2. **Frontend Check:**
   - Open browser: http://localhost:3000
   - Should see the MediTrack landing page

3. **Database Check:**
   ```bash
   mysql -u root -p meditrack
   SELECT COUNT(*) FROM medicines;
   # Should show 20 medicines if seed data ran
   ```

---

## Default Login Credentials

### Admin
- **Email:** `admin@meditrack.com`
- **Password:** `admin123`

### Seed Supplier (for testing)
- **Email:** `seed-supplier@meditrack.com`
- **Password:** `supplier123`

---

## Troubleshooting

### Backend won't start?
- ✅ Check MySQL is running: `sudo systemctl status mysql`
- ✅ Check port 8081 is not in use: `lsof -i :8081`
- ✅ Check database credentials in `backend/src/main/resources/application.properties`

### Frontend won't start?
- ✅ Run `npm install` in frontend directory
- ✅ Check port 3000 is not in use: `lsof -i :3000`
- ✅ Check Node.js version: `node --version` (should be 18+)

### Database connection error?
- ✅ Verify MySQL is running
- ✅ Check username/password in `application.properties`
- ✅ Ensure database `meditrack` exists or `createDatabaseIfNotExist=true` is set

### No medicines showing?
- ✅ Check backend logs for seed data messages
- ✅ Verify database has medicines: `SELECT COUNT(*) FROM medicines;`
- ✅ Check backend is running on port 8081

---

## Stopping the Servers

### Stop Backend:
- Press `Ctrl + C` in the backend terminal

### Stop Frontend:
- Press `Ctrl + C` in the frontend terminal

---

## Next Steps

1. ✅ Open http://localhost:3000 in your browser
2. ✅ Register a new user or login with admin credentials
3. ✅ Browse medicines (20 seed products should be available)
4. ✅ Try the herbal medicines section
5. ✅ Explore admin dashboard features

---

**Happy Coding! 🚀**

















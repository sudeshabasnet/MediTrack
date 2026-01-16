# MediTrack - Medicine Stock and Distribution System

A comprehensive medicine stock and distribution management system built for the Nepal Healthcare System.

## Tech Stack

- **Frontend**: ReactJS + Vite + Tailwind CSS
- **Backend**: Spring Boot 3.2.0 + Java 17
- **Database**: MySQL
- **AI Module**: Flask + scikit-learn
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
MediTrack/
├── frontend/          # React frontend application
├── backend/           # Spring Boot backend API
├── ai-module/         # Flask AI module for forecasting
└── database/          # Database scripts and migrations
```

## Features

### Public Pages
- ✅ Landing Page
- ✅ Login/Registration
- ✅ Forgot Password

### Admin Dashboard
- ✅ Dashboard with statistics and charts
- ✅ Medicine Management (CRUD operations)
- ✅ User Management (Activate/Deactivate/Delete)
- ✅ Reports & Analytics
- ✅ Activity Logs
- ✅ Search and filter medicines
- ✅ Export functionality (CSV/PDF)
- ✅ Low stock and expiry alerts

### Supplier Dashboard
- ✅ Dashboard with own statistics
- ✅ Manage own medicines (CRUD)
- ✅ View stock alerts
- ✅ Track stock value

### Pharmacy Dashboard
- ✅ Dashboard with statistics
- ✅ Browse available medicines
- ✅ Search and filter medicines
- ✅ Shopping cart (UI ready)

### AI Module
- ✅ Demand forecasting
- ✅ Expiry alerts
- ✅ Stock recommendations
- ✅ Usage pattern analysis

### Additional Features
- ✅ Activity/Audit Logging
- ✅ Reports & Analytics
- ✅ Global Exception Handling
- ✅ Error Handling Utilities
- ✅ Loading States
- ✅ Role-based Access Control
- ✅ JWT Authentication

## Prerequisites

- Node.js 18+ and npm
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Python 3.9+

## Setup Instructions

### 1. Database Setup

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE meditrack;
exit;
```

### 2. Backend Setup

```bash
cd backend

# Update application.properties with your MySQL credentials
# Edit: src/main/resources/application.properties

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. AI Module Setup

```bash
cd ai-module

# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask app
python app.py
```

AI Module will run on `http://localhost:5000`

## Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/meditrack
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT
jwt.secret=your-secret-key-change-this-in-production
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:3000
```

### Frontend Configuration

The frontend is configured to proxy API requests to `http://localhost:8080` (see `vite.config.js`).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/forgot-password` - Request password reset

### Admin APIs
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/medicines` - Get all medicines (with pagination)
- `GET /api/admin/medicines/{id}` - Get medicine by ID
- `POST /api/admin/medicines` - Create new medicine
- `PUT /api/admin/medicines/{id}` - Update medicine
- `DELETE /api/admin/medicines/{id}` - Delete medicine

### AI Module APIs
- `POST /api/forecast/train` - Train forecasting model
- `POST /api/forecast/predict` - Predict demand
- `POST /api/analytics/expiry-alerts` - Get expiry alerts
- `POST /api/analytics/stock-recommendations` - Get stock recommendations

## User Roles

- **ADMIN**: Full access to all features
- **SUPPLIER**: Can manage their own medicines
- **PHARMACY**: Can view and order medicines

## Default Admin User

To create an admin user, you can either:
1. Use the registration endpoint and manually update the role in the database
2. Create a data initialization script

## Development

### Running Tests

```bash
# Backend tests
cd backend
mvn test

# Frontend tests (if configured)
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
mvn clean package
java -jar target/meditrack-backend-1.0.0.jar

# Frontend
cd frontend
npm run build
# Serve the dist/ directory
```

## Security Notes

- Change the JWT secret in production
- Use environment variables for sensitive configuration
- Enable HTTPS in production
- Implement rate limiting
- Add input validation and sanitization
- Regular security updates

## License

This project is for educational purposes.

## Contributors

- Development Team

## Support

For issues and questions, please contact the development team.


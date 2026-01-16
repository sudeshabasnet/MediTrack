# Admin Login Guide

## Default Admin Credentials

After running the database initialization script, you can login with:

- **Email:** `admin@meditrack.com`
- **Password:** `admin123`

## Setting Up Admin User

### Option 1: Using SQL Script (Recommended)

1. Make sure your MySQL database is running and the `meditrack` database exists
2. Run the initialization script:

```bash
mysql -u root -p meditrack < database/init.sql
```

This will create the admin user with:
- Email: `admin@meditrack.com`
- Password: `admin123`
- Email verified: `true`
- Verification status: `VERIFIED`
- Active: `true`

### Option 2: Manual SQL Insert

If you prefer to run SQL manually:

```sql
USE meditrack;

INSERT INTO users (
    full_name, 
    email, 
    password, 
    phone_number, 
    role, 
    organization_name, 
    license_number, 
    address, 
    active, 
    email_verified, 
    verification_status, 
    created_at, 
    updated_at
)
VALUES (
    'Admin User',
    'admin@meditrack.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '+977-1-1234567',
    'ADMIN',
    'MediTrack System',
    'ADMIN-001',
    'Kathmandu, Nepal',
    true,
    true,
    'VERIFIED',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE email=email;
```

### Option 3: Register and Update Role

1. Register a new user through the registration page
2. Update the user's role to ADMIN in the database:

```sql
UPDATE users 
SET role = 'ADMIN', 
    email_verified = true, 
    verification_status = 'VERIFIED' 
WHERE email = 'your-email@example.com';
```

## Logging In

1. Go to the login page: `http://localhost:5173/login` (or your frontend URL)
2. Enter the admin credentials:
   - Email: `admin@meditrack.com`
   - Password: `admin123`
3. Click "Login"
4. You will be redirected to the Admin Dashboard

## Admin Features

Once logged in as admin, you can:

- **Dashboard:** View system statistics and overview
- **User Management:** 
  - View all users
  - Activate/Deactivate users
  - Delete users
  - **Verify Pharmacy/Supplier Accounts:** Review legal documents and approve/reject verification requests
- **Medicine Management:** Add, edit, delete medicines
- **Reports:** View analytics and reports

## Important Notes

⚠️ **Security Warning:**
- Change the default admin password in production!
- The default password (`admin123`) is for development/testing only
- Admin users bypass email verification (they can login immediately)

## Troubleshooting

### "Please verify your email before logging in"
- Make sure `email_verified` is set to `true` in the database for the admin user
- Run: `UPDATE users SET email_verified = true WHERE email = 'admin@meditrack.com';`

### "Invalid email or password"
- Verify the password hash matches `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy` (for password: `admin123`)
- Check that the user exists: `SELECT * FROM users WHERE email = 'admin@meditrack.com';`

### Admin user doesn't exist
- Run the `database/init.sql` script
- Or manually insert using Option 2 above

## Changing Admin Password

To change the admin password, you need to generate a new BCrypt hash. You can use an online BCrypt generator or Spring Security's BCryptPasswordEncoder:

```java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String newPasswordHash = encoder.encode("your-new-password");
```

Then update in database:
```sql
UPDATE users SET password = 'your-new-bcrypt-hash' WHERE email = 'admin@meditrack.com';
```

















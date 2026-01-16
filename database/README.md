# Database Setup

## Initial Setup

1. Make sure MySQL is running on your system
2. Update database credentials in `backend/src/main/resources/application.properties`
3. Run the Spring Boot application - it will automatically create tables using Hibernate

## Creating Initial Admin User

### Option 1: Using SQL Script

Run the `init.sql` script after the tables are created:

```bash
mysql -u root -p < database/init.sql
```

### Option 2: Using Registration API

Use the registration endpoint to create a user, then manually update the role to ADMIN in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Option 3: Using Spring Boot Data Initialization

Create a `data.sql` file in `src/main/resources/` with:

```sql
INSERT INTO users (full_name, email, password, phone_number, role, organization_name, license_number, address, active, created_at, updated_at)
VALUES ('Admin User', 'admin@meditrack.com', '$2a$10$...', '+977-1-1234567', 'ADMIN', 'MediTrack', 'ADMIN-001', 'Kathmandu', true, NOW(), NOW());
```

## Default Credentials

After running init.sql:
- Email: admin@meditrack.com
- Password: admin123

**⚠️ IMPORTANT: Change the default password in production!**

## Database Schema

The database schema is automatically managed by Hibernate/JPA. Main tables:

- `users` - User accounts (Admin, Suppliers, Pharmacies)
- `medicines` - Medicine inventory
- Other tables will be created as needed for additional features

## Backup and Restore

### Backup
```bash
mysqldump -u root -p meditrack > meditrack_backup.sql
```

### Restore
```bash
mysql -u root -p meditrack < meditrack_backup.sql
```


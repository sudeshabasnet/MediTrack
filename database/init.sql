-- MediTrack Database Initialization Script
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS meditrack;
USE meditrack;

-- Note: Tables will be automatically created by Hibernate/JPA
-- This script is for reference and can be used to create initial admin user

-- Create admin user (password: admin123)
-- Password hash is for 'admin123' using BCrypt
INSERT INTO users (full_name, email, password, phone_number, role, organization_name, license_number, address, active, email_verified, verification_status, created_at, updated_at)
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

-- You can also create sample suppliers and pharmacies
-- Sample Supplier
INSERT INTO users (full_name, email, password, phone_number, role, organization_name, license_number, address, active, created_at, updated_at)
VALUES (
    'Supplier One',
    'supplier1@meditrack.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '+977-1-2345678',
    'SUPPLIER',
    'ABC Pharmaceuticals',
    'SUP-001',
    'Kathmandu, Nepal',
    true,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE email=email;

-- Sample Pharmacy
INSERT INTO users (full_name, email, password, phone_number, role, organization_name, license_number, address, active, created_at, updated_at)
VALUES (
    'Pharmacy One',
    'pharmacy1@meditrack.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '+977-1-3456789',
    'PHARMACY',
    'XYZ Pharmacy',
    'PHARM-001',
    'Kathmandu, Nepal',
    true,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE email=email;


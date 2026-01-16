# MediTrack PRD (High-Level)

## Authentication & Registration

- The system shall allow **general users** to register without requiring organization or license information.
- The system shall allow **pharmacies** to register, requiring organization name and license number.
- The system shall allow registered users (including pharmacies) to **log in** using email and password.
- After login, users shall be redirected to a **role-specific dashboard**:
  - General User → `/user/dashboard`
  - Pharmacy → `/pharmacy/dashboard`

## Non-Functional

- Registration and login flows must be testable end-to-end via the web frontend at `http://localhost:3000` and backend at `http://localhost:8081`.



















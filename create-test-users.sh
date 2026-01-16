#!/bin/bash

# Script to create test users for TestSprite testing

echo "Creating test users for MediTrack..."

BASE_URL="http://localhost:8081/api/auth/register"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

create_user() {
    local role=$1
    local email=$2
    local password=$3
    local fullName=$4
    local phoneNumber=$5
    local organizationName=$6
    local licenseNumber=$7
    local address=$8

    echo -e "${YELLOW}Creating $role user: $email${NC}"
    
    if [ "$role" = "USER" ]; then
        # General User - no organization/license required
        response=$(curl -s -X POST "$BASE_URL" \
            -H "Content-Type: application/json" \
            -d "{
                \"fullName\": \"$fullName\",
                \"email\": \"$email\",
                \"password\": \"$password\",
                \"phoneNumber\": \"$phoneNumber\",
                \"role\": \"$role\",
                \"organizationName\": \"\",
                \"licenseNumber\": \"\",
                \"address\": \"$address\"
            }")
    else
        # Supplier/Pharmacy - all fields required
        response=$(curl -s -X POST "$BASE_URL" \
            -H "Content-Type: application/json" \
            -d "{
                \"fullName\": \"$fullName\",
                \"email\": \"$email\",
                \"password\": \"$password\",
                \"phoneNumber\": \"$phoneNumber\",
                \"role\": \"$role\",
                \"organizationName\": \"$organizationName\",
                \"licenseNumber\": \"$licenseNumber\",
                \"address\": \"$address\"
            }")
    fi

    if echo "$response" | grep -q "\"id\""; then
        echo -e "${GREEN}✅ $role user created successfully${NC}"
        return 0
    else
        if echo "$response" | grep -q "already exists"; then
            echo -e "${YELLOW}⚠️  User $email already exists${NC}"
            return 0
        else
            echo -e "${RED}❌ Failed to create $role user${NC}"
            echo "Response: $response"
            return 1
        fi
    fi
}

# Check if backend is running
if ! curl -s http://localhost:8081 > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend is not running on http://localhost:8081${NC}"
    echo "Please start the backend first: cd backend && mvn spring-boot:run"
    exit 1
fi

echo -e "${GREEN}✅ Backend is running${NC}"
echo ""

# Create test users
create_user "USER" "user@test.com" "user123" "Test User" "+977-1-9876543" "" "" "Kathmandu, Nepal"
create_user "SUPPLIER" "supplier@test.com" "supplier123" "Test Supplier" "+977-1-9876544" "ABC Pharmaceuticals" "SUP-001" "Kathmandu, Nepal"
create_user "PHARMACY" "pharmacy@test.com" "pharmacy123" "Test Pharmacy" "+977-1-9876545" "XYZ Pharmacy" "PHARM-001" "Kathmandu, Nepal"

echo ""
echo -e "${GREEN}✅ Test users setup complete!${NC}"
echo ""
echo "Test Credentials:"
echo "  USER:     user@test.com / user123"
echo "  SUPPLIER: supplier@test.com / supplier123"
echo "  PHARMACY: pharmacy@test.com / pharmacy123"
echo "  ADMIN:    admin@test.com / admin123 (if already exists)"



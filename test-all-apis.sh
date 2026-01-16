#!/bin/bash

# Comprehensive API Test Script for MediTrack
# This script tests all APIs systematically

BASE_URL="http://localhost:8081"
TEST_EMAIL="testuser1765706376@test.com"
TEST_PASSWORD="testpass123"

echo "=========================================="
echo "MediTrack Comprehensive API Test Suite"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Function to test API endpoint
test_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    local expected_status=$5
    local description=$6
    
    if [ -z "$expected_status" ]; then
        expected_status=200
    fi
    
    if [ -z "$token" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data" 2>&1)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq "$expected_status" ] || [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓${NC} $description (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $description (HTTP $http_code)"
        echo "  Response: $body" | head -c 200
        echo ""
        ((FAILED++))
        return 1
    fi
}

echo "=== 1. Authentication APIs ==="
echo ""

# Register (may fail if user exists, that's OK)
echo "Testing registration..."
test_api "POST" "/api/auth/register" \
    '{"fullName":"API Test User","email":"apitest'$(date +%s)'@test.com","phoneNumber":"+977-1-9999999","address":"Test Address","password":"testpass123","role":"USER"}' \
    "" 200 "Register new user"

# Login
echo "Testing login..."
login_response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo "$login_response" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('token', ''))" 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" == "None" ]; then
    echo -e "${RED}✗${NC} Login failed - cannot continue without token"
    echo "Response: $login_response"
    exit 1
fi

echo -e "${GREEN}✓${NC} Login successful (Token obtained)"
((PASSED++))

# Get Profile
echo "Testing get profile..."
test_api "GET" "/api/auth/profile" "" "$TOKEN" 200 "Get user profile"

echo ""
echo "=== 2. Cart APIs ==="
echo ""

# Get Cart
test_api "GET" "/api/cart" "" "$TOKEN" 200 "Get cart items"

# Get Cart Summary
test_api "GET" "/api/cart/summary" "" "$TOKEN" 200 "Get cart summary"

# Add to Cart (need a medicine ID first - will test with a dummy ID, may fail)
test_api "POST" "/api/cart" '{"medicineId":1,"quantity":1}' "$TOKEN" "200|400" "Add item to cart"

echo ""
echo "=== 3. Order APIs ==="
echo ""

# Get Orders
test_api "GET" "/api/orders" "" "$TOKEN" 200 "Get user orders"

echo ""
echo "=== 4. Review APIs ==="
echo ""

# Get Medicine Reviews (public endpoint)
test_api "GET" "/api/reviews/medicine/1" "" "" 200 "Get medicine reviews"

# Get Average Rating
test_api "GET" "/api/reviews/medicine/1/average" "" "" 200 "Get average rating"

# Create Review (authenticated)
test_api "POST" "/api/reviews" '{"medicineId":1,"rating":5,"comment":"Great medicine!"}' "$TOKEN" "200|400" "Create review"

echo ""
echo "=== 5. Payment APIs ==="
echo ""

# Initiate eSewa Payment
test_api "POST" "/api/payment/esewa" '{"total_amount":100.00}' "" 200 "Initiate eSewa payment"

echo ""
echo "=== 6. Pharmacy APIs (Requires PHARMACY role) ==="
echo ""

# These will fail with 403 if user is not PHARMACY role
test_api "GET" "/api/pharmacy/dashboard" "" "$TOKEN" "200|403" "Get pharmacy dashboard"
test_api "GET" "/api/pharmacy/medicines" "" "$TOKEN" "200|403" "Get pharmacy medicines"

echo ""
echo "=== 7. Supplier APIs (Requires SUPPLIER role) ==="
echo ""

# These will fail with 403 if user is not SUPPLIER role
test_api "GET" "/api/supplier/dashboard" "" "$TOKEN" "200|403" "Get supplier dashboard"
test_api "GET" "/api/supplier/medicines" "" "$TOKEN" "200|403" "Get supplier medicines"

echo ""
echo "=== 8. Admin APIs (Requires ADMIN role) ==="
echo ""

# These will fail with 403 if user is not ADMIN role
test_api "GET" "/api/admin/dashboard" "" "$TOKEN" "200|403" "Get admin dashboard"
test_api "GET" "/api/admin/medicines" "" "$TOKEN" "200|403" "Get admin medicines"
test_api "GET" "/api/admin/users" "" "$TOKEN" "200|403" "Get admin users"

echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}Some tests failed. Check the output above for details.${NC}"
    exit 1
fi



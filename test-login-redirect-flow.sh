#!/bin/bash

# Test Login and Registration Redirect Flow

BASE_URL="http://localhost:8081"
FRONTEND_URL="http://localhost:3000"
TEST_EMAIL="testuser$(date +%s)@test.com"
TEST_PASSWORD="testpass123"

echo "=========================================="
echo "Login & Registration Redirect Test"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

# Step 1: Test Registration
echo "=== 1. Registration Test ==="
REG_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"fullName\": \"Test User\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\",
        \"phoneNumber\": \"+977-1-1234567\",
        \"address\": \"Test Address\",
        \"role\": \"USER\"
    }")

REG_USER_ID=$(echo "$REG_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('id', ''))" 2>/dev/null)

if [ -n "$REG_USER_ID" ] && [ "$REG_USER_ID" != "None" ]; then
    echo -e "${GREEN}✓${NC} Registration successful"
    echo "  User ID: $REG_USER_ID"
    echo "  Email: $TEST_EMAIL"
    echo "  Expected Redirect: /login (after registration)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Registration failed"
    echo "$REG_RESPONSE" | head -3
    ((FAILED++))
    exit 1
fi

# Step 2: Test Login
echo ""
echo "=== 2. Login Test ==="
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('token', ''))" 2>/dev/null)
USER_ROLE=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('user', {}).get('role', ''))" 2>/dev/null)

if [ -n "$TOKEN" ] && [ "$TOKEN" != "None" ]; then
    echo -e "${GREEN}✓${NC} Login successful"
    echo "  Token: Generated"
    echo "  User Role: $USER_ROLE"
    
    # Check expected redirect
    if [ "$USER_ROLE" = "USER" ]; then
        EXPECTED_REDIRECT="/pharmacy/medicines"
        echo "  Expected Redirect: $EXPECTED_REDIRECT (products page)"
    elif [ "$USER_ROLE" = "ADMIN" ]; then
        EXPECTED_REDIRECT="/admin/dashboard"
        echo "  Expected Redirect: $EXPECTED_REDIRECT"
    elif [ "$USER_ROLE" = "SUPPLIER" ]; then
        EXPECTED_REDIRECT="/supplier/dashboard"
        echo "  Expected Redirect: $EXPECTED_REDIRECT"
    elif [ "$USER_ROLE" = "PHARMACY" ]; then
        EXPECTED_REDIRECT="/pharmacy/dashboard"
        echo "  Expected Redirect: $EXPECTED_REDIRECT"
    fi
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Login failed"
    echo "$LOGIN_RESPONSE" | head -3
    ((FAILED++))
    exit 1
fi

# Step 3: Verify Redirect Configuration in Code
echo ""
echo "=== 3. Redirect Configuration Check ==="

# Check LoginPage.jsx
if grep -q "navigate('/pharmacy/medicines')" frontend/src/pages/public/LoginPage.jsx 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Login redirects USER to /pharmacy/medicines"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Login redirect not configured for USER role"
    ((FAILED++))
fi

# Check RegisterPage.jsx
if grep -q "navigate('/login')" frontend/src/pages/public/RegisterPage.jsx 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Registration redirects to /login"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Registration redirect not configured"
    ((FAILED++))
fi

# Step 4: Test Access to Products Page
echo ""
echo "=== 4. Products Page Access Test ==="
if [ -n "$TOKEN" ]; then
    MEDICINES_RESPONSE=$(curl -s -X GET "$BASE_URL/api/pharmacy/medicines" \
        -H "Authorization: Bearer $TOKEN")
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/pharmacy/medicines" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓${NC} Products page accessible (HTTP $HTTP_CODE)"
        MEDICINE_COUNT=$(echo "$MEDICINES_RESPONSE" | python3 -c "import sys, json; meds=json.load(sys.stdin); print(len(meds) if isinstance(meds, list) else 0)" 2>/dev/null)
        echo "  Found $MEDICINE_COUNT medicines"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Products page access denied (HTTP $HTTP_CODE)"
        ((FAILED++))
    fi
fi

# Summary
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
    echo ""
    echo "Expected Flow:"
    echo "  1. User registers → Redirects to /login"
    echo "  2. User logs in → Redirects to /pharmacy/medicines (products page)"
    echo "  3. Products page is accessible"
    exit 0
else
    echo -e "${YELLOW}Some tests failed.${NC}"
    exit 1
fi



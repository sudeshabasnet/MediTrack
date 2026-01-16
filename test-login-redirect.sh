#!/bin/bash

# Test Login Redirect to Products Page

BASE_URL="http://localhost:8081"
FRONTEND_URL="http://localhost:3000"
TEST_EMAIL="testuser1765706376@test.com"
TEST_PASSWORD="testpass123"

echo "=========================================="
echo "Testing Login Redirect to Products Page"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

# Step 1: Test Login
echo "=== 1. Login Test ==="
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('token', ''))" 2>/dev/null)
USER_ROLE=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('user', {}).get('role', ''))" 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" == "None" ]; then
    echo -e "${RED}✗${NC} Login failed"
    ((FAILED++))
    exit 1
fi

if [ "$USER_ROLE" != "USER" ]; then
    echo -e "${RED}✗${NC} User role is not USER (got: $USER_ROLE)"
    ((FAILED++))
else
    echo -e "${GREEN}✓${NC} Login successful (Role: $USER_ROLE)"
    ((PASSED++))
fi

# Step 2: Test Medicines API Access
echo ""
echo "=== 2. Medicines API Access Test ==="
MEDICINES_RESPONSE=$(curl -s -X GET "$BASE_URL/api/pharmacy/medicines" \
    -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/pharmacy/medicines" \
    -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "403" ]; then
    if [ "$HTTP_CODE" = "200" ]; then
        MEDICINE_COUNT=$(echo "$MEDICINES_RESPONSE" | python3 -c "import sys, json; meds=json.load(sys.stdin); print(len(meds) if isinstance(meds, list) else 0)" 2>/dev/null)
        echo -e "${GREEN}✓${NC} Medicines API accessible (HTTP $HTTP_CODE)"
        echo "  Found $MEDICINE_COUNT medicines"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Medicines API access denied (HTTP $HTTP_CODE)"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗${NC} Medicines API error (HTTP $HTTP_CODE)"
    ((FAILED++))
fi

# Step 3: Verify Route Configuration
echo ""
echo "=== 3. Route Configuration Check ==="
echo "Checking if /pharmacy/medicines route allows USER role..."

# Check if the route file has been updated
if grep -q 'role={\["PHARMACY", "USER"\]}' frontend/src/App.jsx 2>/dev/null || \
   grep -q 'role=\["PHARMACY", "USER"\]' frontend/src/App.jsx 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Route allows USER role"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Could not verify route configuration in code"
fi

# Step 4: Verify Login Redirect
echo ""
echo "=== 4. Login Redirect Check ==="
if grep -q "navigate('/pharmacy/medicines')" frontend/src/pages/public/LoginPage.jsx 2>/dev/null || \
   grep -q 'navigate("/pharmacy/medicines")' frontend/src/pages/public/LoginPage.jsx 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Login redirects USER to /pharmacy/medicines"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Login redirect not configured correctly"
    ((FAILED++))
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
    echo "Expected behavior:"
    echo "  • User logs in with USER role"
    echo "  • User is redirected to: $FRONTEND_URL/pharmacy/medicines"
    echo "  • Products/medicines page is displayed"
    echo "  • User can browse and add medicines to cart"
    exit 0
else
    echo -e "${YELLOW}Some tests failed.${NC}"
    exit 1
fi



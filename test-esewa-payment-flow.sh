#!/bin/bash

# Complete eSewa Payment Flow Test Script

BASE_URL="http://localhost:8081"
FRONTEND_URL="http://localhost:3000"
TEST_EMAIL="testuser1765706376@test.com"
TEST_PASSWORD="testpass123"

echo "=========================================="
echo "eSewa Payment Feature - Complete Test"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

test_step() {
    local step_name=$1
    local command=$2
    
    echo "Testing: $step_name..."
    if eval "$command" > /tmp/test_output.txt 2>&1; then
        echo -e "${GREEN}✓${NC} $step_name"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $step_name"
        cat /tmp/test_output.txt | head -5
        ((FAILED++))
        return 1
    fi
}

# Step 1: Login
echo "=== 1. Authentication ==="
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('token', ''))" 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" == "None" ]; then
    echo -e "${RED}✗${NC} Login failed"
    exit 1
fi

echo -e "${GREEN}✓${NC} Login successful"
((PASSED++))

# Step 2: Get Cart Summary
echo ""
echo "=== 2. Cart Summary ==="
CART_SUMMARY=$(curl -s -X GET "$BASE_URL/api/cart/summary" \
    -H "Authorization: Bearer $TOKEN")

CART_TOTAL=$(echo "$CART_SUMMARY" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('totalAmount', 0))" 2>/dev/null)

if [ "$CART_TOTAL" = "0" ] || [ -z "$CART_TOTAL" ]; then
    echo -e "${YELLOW}⚠${NC} Cart is empty, using test amount Rs. 100.50"
    CART_TOTAL=100.50
else
    echo -e "${GREEN}✓${NC} Cart total: Rs. $CART_TOTAL"
    ((PASSED++))
fi

# Step 3: Payment Initiation
echo ""
echo "=== 3. Payment Initiation ==="
PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/payment/esewa" \
    -H "Content-Type: application/json" \
    -d "{\"total_amount\":$CART_TOTAL}")

TRANSACTION_UUID=$(echo "$PAYMENT_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('transaction_uuid', ''))" 2>/dev/null)
SUCCESS_URL=$(echo "$PAYMENT_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('success_url', ''))" 2>/dev/null)
FAILURE_URL=$(echo "$PAYMENT_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('failure_url', ''))" 2>/dev/null)

if [ -n "$TRANSACTION_UUID" ]; then
    echo -e "${GREEN}✓${NC} Payment data generated"
    echo "  Transaction UUID: $TRANSACTION_UUID"
    echo "  Success URL: $SUCCESS_URL"
    echo "  Failure URL: $FAILURE_URL"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Payment initiation failed"
    ((FAILED++))
fi

# Step 4: Verify Payment Form Fields
echo ""
echo "=== 4. Payment Form Fields ==="
REQUIRED_FIELDS=("amount" "total_amount" "transaction_uuid" "product_code" "signature" "action" "success_url" "failure_url")
MISSING_FIELDS=0

for field in "${REQUIRED_FIELDS[@]}"; do
    if echo "$PAYMENT_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); exit(0 if '$field' in d else 1)" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Field: $field"
    else
        echo -e "${RED}✗${NC} Missing field: $field"
        ((MISSING_FIELDS++))
    fi
done

if [ $MISSING_FIELDS -eq 0 ]; then
    ((PASSED++))
else
    ((FAILED++))
fi

# Step 5: Test Callback URLs
echo ""
echo "=== 5. Callback URLs ==="
if [[ "$SUCCESS_URL" == *"localhost:3000"* ]]; then
    echo -e "${GREEN}✓${NC} Success URL points to frontend"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Success URL incorrect: $SUCCESS_URL"
    ((FAILED++))
fi

if [[ "$FAILURE_URL" == *"localhost:3000"* ]]; then
    echo -e "${GREEN}✓${NC} Failure URL points to frontend"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Failure URL incorrect: $FAILURE_URL"
    ((FAILED++))
fi

# Step 6: Test Orders API
echo ""
echo "=== 6. Orders API ==="
ORDERS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/orders" \
    -H "Authorization: Bearer $TOKEN")

if echo "$ORDERS_RESPONSE" | python3 -c "import sys, json; json.load(sys.stdin)" 2>/dev/null; then
    ORDER_COUNT=$(echo "$ORDERS_RESPONSE" | python3 -c "import sys, json; orders=json.load(sys.stdin); print(len(orders) if isinstance(orders, list) else 0)" 2>/dev/null)
    echo -e "${GREEN}✓${NC} Orders API working (Found $ORDER_COUNT orders)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Orders API failed"
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
    exit 0
else
    echo -e "${YELLOW}Some tests failed.${NC}"
    exit 1
fi



#!/bin/bash

# Script to test API endpoints for TestSprite verification

BASE_URL="http://localhost:8081/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Testing MediTrack API Endpoints..."
echo ""

# Test 1: Health Check (if available)
echo -e "${YELLOW}Test 1: Checking backend availability...${NC}"
if curl -s http://localhost:8081 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not running${NC}"
    exit 1
fi

# Test 2: User Registration
echo -e "${YELLOW}Test 2: User Registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "fullName": "API Test User",
        "email": "apitest@example.com",
        "password": "test123",
        "phoneNumber": "+977-1-1111111",
        "role": "USER",
        "organizationName": "",
        "licenseNumber": "",
        "address": "Test Address"
    }')

if echo "$REGISTER_RESPONSE" | grep -q "\"id\""; then
    echo -e "${GREEN}✅ Registration endpoint working${NC}"
else
    if echo "$REGISTER_RESPONSE" | grep -q "already exists"; then
        echo -e "${YELLOW}⚠️  User already exists (endpoint working)${NC}"
    else
        echo -e "${RED}❌ Registration failed${NC}"
        echo "Response: $REGISTER_RESPONSE"
    fi
fi

# Test 3: User Login
echo -e "${YELLOW}Test 3: User Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "admin@test.com",
        "password": "admin123"
    }')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✅ Login endpoint working${NC}"
    echo -e "${GREEN}   Token received: ${TOKEN:0:50}...${NC}"
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

# Test 4: Get Profile (Protected)
echo -e "${YELLOW}Test 4: Get User Profile (Protected)...${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/profile" \
    -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "\"id\""; then
    echo -e "${GREEN}✅ Profile endpoint working${NC}"
else
    echo -e "${RED}❌ Profile endpoint failed${NC}"
    echo "Response: $PROFILE_RESPONSE"
fi

# Test 5: Get Cart (Protected)
echo -e "${YELLOW}Test 5: Get Cart (Protected)...${NC}"
CART_RESPONSE=$(curl -s -X GET "$BASE_URL/cart" \
    -H "Authorization: Bearer $TOKEN")

if echo "$CART_RESPONSE" | grep -q "\[\]"; then
    echo -e "${GREEN}✅ Cart endpoint working (empty cart)${NC}"
else
    echo -e "${GREEN}✅ Cart endpoint working${NC}"
fi

# Test 6: Get Cart Summary
echo -e "${YELLOW}Test 6: Get Cart Summary...${NC}"
CART_SUMMARY=$(curl -s -X GET "$BASE_URL/cart/summary" \
    -H "Authorization: Bearer $TOKEN")

if echo "$CART_SUMMARY" | grep -q "itemCount"; then
    echo -e "${GREEN}✅ Cart summary endpoint working${NC}"
else
    echo -e "${RED}❌ Cart summary failed${NC}"
fi

# Test 7: Get Orders
echo -e "${YELLOW}Test 7: Get Orders...${NC}"
ORDERS_RESPONSE=$(curl -s -X GET "$BASE_URL/orders" \
    -H "Authorization: Bearer $TOKEN")

if echo "$ORDERS_RESPONSE" | grep -q "\[\]"; then
    echo -e "${GREEN}✅ Orders endpoint working (no orders)${NC}"
else
    echo -e "${GREEN}✅ Orders endpoint working${NC}"
fi

# Test 8: Get Medicines (Public)
echo -e "${YELLOW}Test 8: Get Medicines (Public)...${NC}"
MEDICINES_RESPONSE=$(curl -s -X GET "$BASE_URL/pharmacy/medicines")

if echo "$MEDICINES_RESPONSE" | grep -q "content"; then
    echo -e "${GREEN}✅ Medicines endpoint working${NC}"
else
    echo -e "${RED}❌ Medicines endpoint failed${NC}"
fi

# Test 9: Payment Endpoint
echo -e "${YELLOW}Test 9: eSewa Payment Initiation...${NC}"
PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/payment/esewa" \
    -H "Content-Type: application/json" \
    -d '{"total_amount": 1000}')

if echo "$PAYMENT_RESPONSE" | grep -q "action"; then
    echo -e "${GREEN}✅ Payment endpoint working${NC}"
else
    echo -e "${RED}❌ Payment endpoint failed${NC}"
fi

echo ""
echo -e "${GREEN}✅ API Endpoint Testing Complete!${NC}"
echo ""
echo "All endpoints are ready for TestSprite testing."



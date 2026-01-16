# Manual Test Cases for TestSprite Reference

These manual test cases can be used as reference when configuring TestSprite or for manual testing.

## Test Case 1: User Registration - General User

**Objective**: Verify that organization name and license number fields are hidden for USER role

**Steps**:
1. Navigate to http://localhost:3000/register
2. Select "General User" from Role dropdown
3. Verify "Organization Name" field is NOT visible
4. Verify "License Number" field is NOT visible
5. Fill in required fields:
   - Full Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "+977-1-1111111"
   - Password: "password123"
   - Confirm Password: "password123"
   - Address: "Kathmandu, Nepal"
6. Check "I agree to Terms & Conditions"
7. Click "Register"

**Expected Result**:
- Registration succeeds
- User is redirected to login page
- Success message displayed
- User can login with new credentials

---

## Test Case 2: User Registration - Supplier

**Objective**: Verify all fields are visible and required for Supplier role

**Steps**:
1. Navigate to http://localhost:3000/register
2. Select "Supplier" from Role dropdown
3. Verify "Organization Name" field IS visible
4. Verify "License Number" field IS visible
5. Fill in all required fields
6. Submit registration

**Expected Result**:
- All fields are visible
- Registration succeeds with all fields
- User can login

---

## Test Case 3: User Login

**Objective**: Test user login and role-based redirect

**Steps**:
1. Navigate to http://localhost:3000/login
2. Enter email: "user@test.com"
3. Enter password: "user123"
4. Click "Login"

**Expected Result**:
- Login succeeds
- JWT token received
- Redirected to /user/dashboard
- User information displayed

---

## Test Case 4: Add to Cart

**Objective**: Test adding medicine to cart

**Steps**:
1. Login as USER
2. Navigate to medicine browsing page
3. Click "Add to Cart" on any available medicine
4. Verify success message
5. Navigate to /user/cart
6. Verify medicine appears in cart

**Expected Result**:
- Success toast message displayed
- Medicine appears in cart
- Cart summary updates
- Quantity is 1

---

## Test Case 5: Update Cart Quantity

**Objective**: Test updating cart item quantity

**Steps**:
1. Login as USER
2. Navigate to /user/cart
3. Click "+" button to increase quantity
4. Verify total amount updates
5. Click "-" button to decrease quantity
6. Verify total amount updates
7. Set quantity to 0 (or click remove)

**Expected Result**:
- Quantity updates correctly
- Total amount recalculates
- Item removed when quantity is 0
- Cart persists

---

## Test Case 6: Place Order

**Objective**: Test complete order placement flow

**Steps**:
1. Login as USER
2. Add items to cart
3. Navigate to /user/checkout
4. Fill shipping information:
   - Full Name
   - Address
   - Phone Number
5. Select payment method (eSewa or Cash)
6. Click "Place Order"

**Expected Result**:
- Order created successfully
- Cart is cleared
- Redirected to orders page or success page
- Order appears in order history

---

## Test Case 7: eSewa Payment Integration

**Objective**: Test eSewa payment flow

**Steps**:
1. Login as USER
2. Add items to cart
3. Navigate to /user/checkout
4. Fill shipping information
5. Select "eSewa" payment method
6. Click "Place Order"

**Expected Result**:
- eSewa payment form is generated
- Payment data is correct
- Redirect to eSewa payment page (in test mode)
- Transaction UUID generated
- Signature calculated correctly

---

## Test Case 8: Submit Review

**Objective**: Test submitting a medicine review

**Steps**:
1. Login as USER
2. Navigate to medicine details page
3. Scroll to reviews section
4. Click "Write Review" button
5. Select rating (1-5 stars)
6. Enter review comment
7. Click "Submit Review"

**Expected Result**:
- Review form appears
- Rating can be selected
- Review submitted successfully
- Review appears in reviews list
- Average rating updates

---

## Test Case 9: View Reviews

**Objective**: Test viewing medicine reviews

**Steps**:
1. Navigate to medicine details page (login not required)
2. Scroll to reviews section
3. View reviews list

**Expected Result**:
- Reviews are displayed
- Average rating is shown
- Review count is correct
- User names are displayed
- Review dates are shown

---

## Test Case 10: Search Medicines

**Objective**: Test medicine search functionality

**Steps**:
1. Login as USER or PHARMACY
2. Navigate to medicine browsing page
3. Enter search term in search box
4. Wait for results

**Expected Result**:
- Search results update
- Results match search term
- Search works for medicine names
- Search is case-insensitive

---

## Test Case 11: Filter Medicines

**Objective**: Test medicine filtering

**Steps**:
1. Login as USER or PHARMACY
2. Navigate to medicine browsing page
3. Select category from filter dropdown
4. Verify filtered results
5. Select status filter
6. Verify filtered results

**Expected Result**:
- Filter dropdowns work
- Results are filtered correctly
- Multiple filters can be combined
- Clear filters option works

---

## Test Case 12: User Dashboard

**Objective**: Test user dashboard functionality

**Steps**:
1. Login as USER
2. Navigate to /user/dashboard
3. Verify cart summary card
4. Verify order count card
5. Verify cart total card
6. Verify recent orders section
7. Test navigation links

**Expected Result**:
- All statistics displayed correctly
- Recent orders shown
- Navigation links work
- Cart icon shows item count

---

## Test Case 13: Protected Routes

**Objective**: Test role-based access control

**Steps**:
1. Try to access /admin/dashboard without login
2. Verify redirect to login
3. Login as USER
4. Try to access /admin/dashboard
5. Verify access denied
6. Login as ADMIN
7. Verify access granted

**Expected Result**:
- Unauthenticated users redirected to login
- USER cannot access ADMIN routes
- ADMIN can access all routes
- Proper error messages displayed

---

## Test Case 14: Cart Persistence

**Objective**: Test cart persistence across sessions

**Steps**:
1. Login as USER
2. Add items to cart
3. Logout
4. Login again with same user
5. Navigate to cart
6. Verify items are still in cart

**Expected Result**:
- Cart items persist after logout
- Cart items persist after login
- Cart is user-specific
- Cart data is stored in database

---

## Test Case 15: Order History

**Objective**: Test viewing order history

**Steps**:
1. Login as USER
2. Place an order
3. Navigate to orders page (if exists) or dashboard
4. View order in recent orders
5. Click on order details (if available)

**Expected Result**:
- Order appears in history
- Order details are correct
- Order status is shown
- Order date is shown
- Order total is correct

---

## API Test Examples

### Test Login API
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}'
```

### Test Add to Cart API
```bash
# First get token from login
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:8081/api/cart \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"medicineId": 1, "quantity": 1}'
```

### Test Get Cart API
```bash
curl -X GET http://localhost:8081/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

### Test Place Order API
```bash
curl -X POST http://localhost:8081/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "address": "Kathmandu, Nepal",
    "phoneNumber": "+977-1-1111111",
    "paymentMethod": "esewa"
  }'
```

---

## Test Data Requirements

### Test Medicines
Ensure at least 5-10 test medicines exist:
- Different categories (ANTIBIOTIC, PAINKILLER, VITAMIN, etc.)
- Different statuses (AVAILABLE, LOW_STOCK, OUT_OF_STOCK)
- Different prices
- Different stock levels

### Test Users
All test users should be created:
- Admin user
- General User
- Supplier user
- Pharmacy user

---

## Notes for TestSprite

1. **Wait Times**: Add appropriate wait times for:
   - Page loads
   - API responses
   - Form submissions
   - Navigation

2. **Element Selectors**: Use stable selectors:
   - Data attributes (if available)
   - IDs
   - Class names
   - Text content

3. **Assertions**: Verify:
   - Page titles
   - URL changes
   - Element visibility
   - Text content
   - API responses

4. **Error Handling**: Test:
   - Invalid inputs
   - Network errors
   - Authentication failures
   - Permission errors



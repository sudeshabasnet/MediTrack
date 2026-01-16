# MediTrack - Complete Testing Guide

## 🚀 Server Status

Both servers should be running:
- **Backend**: http://localhost:8080
- **Frontend**: http://localhost:3000

---

## 📋 Test Scenarios

### 1. Email Verification During Registration

#### Test Case 1.1: Supplier Registration with Email Verification
**Steps:**
1. Navigate to http://localhost:3000/register
2. Click on "Register" in the header
3. **Step 1 - Email Verification:**
   - Enter your email address (use a real email you can access)
   - Click "Send Code"
   - Check your email inbox for the 6-digit verification code
   - Enter the code in the "Verification Code" field
   - Click "Verify"
   - ✅ **Expected**: Email is verified, you proceed to Step 2

4. **Step 2 - Complete Registration:**
   - Fill in all required fields:
     - Full Name: "Test Supplier"
     - Email: (already filled and disabled with checkmark)
     - Phone Number: "9876543210"
     - Role: Select "Supplier"
     - Organization Name: "ABC Pharmaceuticals"
     - License Number: "SUP-2024-001"
     - Upload Legal Document: Upload a PDF or image file
     - Address: "123 Main Street, Kathmandu"
     - Password: "password123"
     - Confirm Password: "password123"
     - Check "I agree to Terms & Conditions"
   - Click "Create Account"
   - ✅ **Expected**: Registration successful, redirected to login page

#### Test Case 1.2: General User Registration
**Steps:**
1. Go to http://localhost:3000/register
2. Verify email with code (same as above)
3. Complete registration:
   - Full Name: "Test User"
   - Role: Select "General User" (no document upload needed)
   - Fill other fields
   - Submit
4. ✅ **Expected**: Auto-verified, can login immediately

---

### 2. Admin Document Review & Verification

#### Test Case 2.1: Admin Login
**Steps:**
1. Navigate to http://localhost:3000/login
2. Login with admin credentials:
   - Email: `admin@meditrack.com`
   - Password: `admin123`
3. ✅ **Expected**: Redirected to admin dashboard

#### Test Case 2.2: Review Pending Verifications
**Steps:**
1. After admin login, click "User Verification" in the sidebar
2. ✅ **Expected**: See the newly registered supplier in the list
3. Observe:
   - Status badge showing "PENDING"
   - Organization name and contact person
   - License number
4. Click "Review" button on the supplier

#### Test Case 2.3: View Document Details
**Steps:**
1. In the verification modal:
   - View Account Information (email, phone, role)
   - View Business Information (organization, license, address)
   - View Legal Document (PDF or image preview)
   - If PDF: Click "View PDF" to open in new tab
   - If Image: Click on image to zoom/preview
2. ✅ **Expected**: All information is clearly displayed

#### Test Case 2.4: Approve User
**Steps:**
1. In the verification modal, click "Approve" button
2. ✅ **Expected**: 
   - Success message appears
   - User status changes to "VERIFIED"
   - Email sent to user notifying approval
3. Check the user's email inbox for approval notification

#### Test Case 2.5: Reject User
**Steps:**
1. Register another supplier (follow Test Case 1.1)
2. Admin reviews the new supplier
3. Enter rejection reason: "Invalid license document"
4. Click "Reject" button
5. ✅ **Expected**:
   - Success message appears
   - User status changes to "REJECTED"
   - Email sent with rejection reason
6. Check the user's email for rejection notification

---

### 3. Verification Status Indicators

#### Test Case 3.1: Verified Supplier Dashboard
**Steps:**
1. Login as the approved supplier
2. Navigate to dashboard
3. ✅ **Expected**: 
   - No verification alerts shown
   - Full access to all features
   - Can see statistics and quick actions

#### Test Case 3.2: Unverified Supplier Restrictions
**Steps:**
1. Login as the rejected/pending supplier
2. Navigate to dashboard
3. ✅ **Expected**:
   - Warning/Error alert at top showing verification status
   - Clear message about limitations

#### Test Case 3.3: Medicine Management Restrictions
**Steps:**
1. As unverified supplier, go to "My Medicines"
2. ✅ **Expected**:
   - Verification alert at top of page
   - "Add Medicine" button is disabled
   - Cannot add new medicines

#### Test Case 3.4: Verified Supplier Can Add Medicines
**Steps:**
1. As verified supplier, go to "My Medicines"
2. Click "Add Medicine" button
3. Fill in medicine details and submit
4. ✅ **Expected**:
   - Medicine added successfully
   - Appears in the list

---

### 4. Email Notifications

#### Test Case 4.1: Order Confirmation Email
**Steps:**
1. Login as a general user
2. Browse medicines and add to cart
3. Go to cart and proceed to checkout
4. Complete order with:
   - Shipping details
   - Payment method
5. Place order
6. ✅ **Expected**:
   - Order confirmation on screen
   - Email sent to customer with order details
   - Check email inbox for formatted order confirmation

#### Test Case 4.2: Admin Order Notification
**Steps:**
1. After placing order (Test Case 4.1)
2. Check admin email inbox
3. ✅ **Expected**:
   - Email notification about new order
   - Contains order ID and customer name
   - Link to admin order management

#### Test Case 4.3: Order Status Update Email
**Steps:**
1. Login as admin
2. Go to "Orders" in sidebar
3. Find the recent order
4. Change status from "PENDING" to "CONFIRMED"
5. ✅ **Expected**:
   - Status updated successfully
   - Customer receives email notification
   - Email contains new status and order ID

#### Test Case 4.4: Login Notification
**Steps:**
1. Login to any account
2. Check email inbox
3. ✅ **Expected**:
   - Email notification about successful login
   - Contains login time
   - Security message

---

### 5. Profile Verification Status Display

#### Test Case 5.1: View Verification Status in Profile
**Steps:**
1. Login as supplier/pharmacy
2. Click on profile icon → "Profile"
3. ✅ **Expected**:
   - Profile page shows verification status badge
   - Color-coded: Green (Verified), Yellow (Pending), Red (Rejected)
   - Icon indicators for visual clarity

---

### 6. Complete User Flows

#### Flow 1: New Supplier Onboarding
```
1. Register with email verification ✓
2. Upload legal documents ✓
3. Receive registration confirmation ✓
4. Wait for admin review (status: PENDING) ✓
5. Admin reviews documents ✓
6. Admin approves ✓
7. Receive approval email ✓
8. Login and add medicines ✓
9. Receive orders ✓
10. Get email notifications ✓
```

#### Flow 2: Customer Order Journey
```
1. Register as general user ✓
2. Auto-verified ✓
3. Browse medicines ✓
4. Add to cart ✓
5. Checkout ✓
6. Receive order confirmation email ✓
7. Admin updates order status ✓
8. Receive status update email ✓
```

---

## 🔍 Verification Checklist

### Registration & Email Verification
- [ ] Email verification code sent successfully
- [ ] Code validation works correctly
- [ ] Invalid code shows error
- [ ] Resend code functionality works
- [ ] Step progression works smoothly
- [ ] Document upload for suppliers/pharmacies
- [ ] Document preview works
- [ ] File type validation works
- [ ] File size validation works
- [ ] Registration completes successfully

### Admin Verification System
- [ ] Admin can view pending verifications
- [ ] Filter by role works (Supplier/Pharmacy)
- [ ] Filter by status works (Pending/Verified/Rejected)
- [ ] Search functionality works
- [ ] Statistics show correct counts
- [ ] Document viewer works for images
- [ ] PDF opens in new tab
- [ ] Approval process works
- [ ] Rejection with reason works
- [ ] Status updates correctly in database

### Email Notifications
- [ ] Email verification code received
- [ ] Registration confirmation received
- [ ] Verification approval email received
- [ ] Verification rejection email received (with reason)
- [ ] Order confirmation email received
- [ ] Admin new order notification received
- [ ] Order status update email received
- [ ] Login notification received
- [ ] All emails properly formatted
- [ ] All links in emails work

### Verification Status UI
- [ ] Dashboard shows verification alerts
- [ ] Medicine management shows restrictions
- [ ] Add Medicine button disabled for unverified
- [ ] Profile shows verification badge
- [ ] Status colors correct (Green/Yellow/Red)
- [ ] Icons display correctly
- [ ] Messages are clear and helpful

### Feature Access Control
- [ ] Unverified suppliers cannot add medicines
- [ ] Verified suppliers can add medicines
- [ ] General users have immediate access
- [ ] Admin has full access
- [ ] Backend validates verification status

---

## 🐛 Common Issues & Solutions

### Issue 1: Email not received
**Solution**: 
- Check spam/junk folder
- Verify email configuration in `application.properties`
- Check backend logs for email sending errors
- Ensure SMTP credentials are correct

### Issue 2: Document upload fails
**Solution**:
- Check file size (must be < 10MB)
- Verify file type (PDF, JPG, PNG, GIF only)
- Check backend upload directory permissions
- Review browser console for errors

### Issue 3: Verification status not updating
**Solution**:
- Check backend logs for errors
- Verify database connection
- Ensure user ID is correct
- Check network tab in browser DevTools

### Issue 4: Backend not starting
**Solution**:
- Check if port 8080 is already in use
- Verify database is running
- Check `application.properties` configuration
- Review Maven logs for compilation errors

### Issue 5: Frontend not loading
**Solution**:
- Check if port 3000 is available
- Run `npm install` if dependencies missing
- Clear browser cache
- Check browser console for errors

---

## 📊 Test Data

### Admin Credentials
```
Email: admin@meditrack.com
Password: admin123
```

### Test Supplier (After Registration)
```
Email: supplier@test.com
Organization: ABC Pharmaceuticals
License: SUP-2024-001
```

### Test Pharmacy (After Registration)
```
Email: pharmacy@test.com
Organization: XYZ Pharmacy
License: PHA-2024-001
```

### Test User
```
Email: user@test.com
Name: Test User
```

---

## 🎯 Success Criteria

All tests pass when:
1. ✅ Email verification works end-to-end
2. ✅ Document upload and preview functional
3. ✅ Admin can review and approve/reject
4. ✅ All email notifications sent correctly
5. ✅ Verification status displayed properly
6. ✅ Feature access control enforced
7. ✅ No console errors
8. ✅ No backend exceptions
9. ✅ UI is responsive and user-friendly
10. ✅ Complete user flows work seamlessly

---

## 📝 Notes

- **Email Configuration**: Make sure to configure real SMTP credentials in `backend/src/main/resources/application.properties` for testing email functionality
- **Database**: Ensure MySQL is running and database is created
- **Ports**: Backend (8080), Frontend (3000) must be available
- **Browser**: Use Chrome/Firefox with DevTools open for debugging
- **Network**: Check Network tab for API call responses
- **Console**: Monitor console for any JavaScript errors

---

## 🎉 Testing Complete!

Once all test cases pass, the verification and email notification system is fully functional and ready for production deployment.

For any issues or questions, refer to `VERIFICATION_FLOW_IMPLEMENTATION.md` for technical details.











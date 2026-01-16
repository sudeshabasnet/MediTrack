# Email Verification Guide

## How Email Verification Works

### For Users

1. **After Registration:**
   - When you register a new account, a verification email is automatically sent to your email address
   - The email contains a verification link that expires in 24 hours
   - You'll see a success message: "Registration successful! Please check your email to verify your account."

2. **Verifying Your Email:**
   - Check your email inbox (and spam folder) for an email from MediTrack
   - Click on the verification link in the email
   - You'll be redirected to the verification page
   - If successful, you'll see a green checkmark and a success message
   - You'll be automatically redirected to the login page after 3 seconds

3. **If You Didn't Receive the Email:**
   - Check your spam/junk folder
   - Wait a few minutes (emails can sometimes be delayed)
   - Use the "Resend Verification Email" button on the login page
   - Make sure you entered the correct email address during registration

4. **After Verification:**
   - You can now log in to your account
   - Your email status will show as "Verified" in your profile

### For Pharmacy/Supplier Users

1. **Two-Step Verification Process:**
   - **Step 1:** Email Verification (same as above)
   - **Step 2:** Admin Verification (for legal documents)
   
2. **After Email Verification:**
   - Your email will be verified
   - However, you still need admin approval for your legal documents
   - Your account status will show "Pending" until admin verifies your documents
   - You'll receive an email notification when admin approves/rejects your account

3. **Admin Verification:**
   - Admin reviews your uploaded legal documents
   - Admin can approve or reject your verification
   - You'll receive an email notification about the decision
   - Only after admin approval can you fully access the system

### Troubleshooting

**Problem: "Please verify your email before logging in"**
- **Solution:** Check your email and click the verification link
- **Alternative:** Use "Resend Verification Email" on the login page

**Problem: Verification link expired**
- **Solution:** Use "Resend Verification Email" to get a new link
- Links expire after 24 hours for security reasons

**Problem: Can't find verification email**
- **Solution 1:** Check spam/junk folder
- **Solution 2:** Wait a few minutes and check again
- **Solution 3:** Use "Resend Verification Email" button
- **Solution 4:** Verify you used the correct email address

**Problem: "Your account verification is pending" (for Pharmacy/Supplier)**
- **Solution:** This means your email is verified but admin hasn't approved your legal documents yet
- Wait for admin to review and approve your documents
- You'll receive an email when the decision is made

### Quick Links

- **Login Page:** http://localhost:3000/login
- **Verification Page:** http://localhost:3000/verify-email?token=YOUR_TOKEN
- **Register Page:** http://localhost:3000/register

### Email Format

The verification email will look like this:

```
Subject: Verify Your MediTrack Account

Dear [Your Name],

Thank you for registering with MediTrack!

Please verify your email address by clicking the following link:
http://localhost:3000/verify-email?token=[VERIFICATION_TOKEN]

This link will expire in 24 hours.

If you did not register for MediTrack, please ignore this email.

Best regards,
MediTrack Team
```

### Security Notes

- Verification links expire after 24 hours
- Each verification link can only be used once
- If you need a new link, use the "Resend Verification Email" feature
- Never share your verification link with anyone

















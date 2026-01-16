package com.meditrack.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String token, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Verify Your MediTrack Account");
            message.setText(
                "Dear " + userName + ",\n\n" +
                "Thank you for registering with MediTrack!\n\n" +
                "Please verify your email address by clicking the following link:\n" +
                frontendUrl + "/verify-email?token=" + token + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you did not register for MediTrack, please ignore this email.\n\n" +
                "Best regards,\n" +
                "MediTrack Team"
            );
            mailSender.send(message);
            log.info("Verification email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public void sendLoginNotification(String toEmail, String userName, String loginTime) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediTrack - Login Notification");
            message.setText(
                "Dear " + userName + ",\n\n" +
                "You have successfully logged into your MediTrack account.\n\n" +
                "Login Time: " + loginTime + "\n\n" +
                "If this was not you, please contact support immediately.\n\n" +
                "Best regards,\n" +
                "MediTrack Team"
            );
            mailSender.send(message);
            log.info("Login notification sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send login notification to: {}", toEmail, e);
            // Don't throw exception for login notifications
        }
    }

    public void sendOrderConfirmation(String toEmail, String userName, String orderId, Double totalAmount, 
                                      String paymentMethod, String address, String phoneNumber) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediTrack - Order Confirmation #" + orderId);
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(userName).append(",\n\n");
            emailBody.append("Thank you for your order! Your order has been placed successfully.\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("ORDER DETAILS\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("Order ID: #").append(orderId).append("\n");
            emailBody.append("Order Date: ").append(java.time.LocalDateTime.now().format(
                java.time.format.DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a"))).append("\n");
            emailBody.append("Total Amount: Rs. ").append(String.format("%.2f", totalAmount)).append("\n");
            emailBody.append("Payment Method: ").append(paymentMethod != null ? paymentMethod.toUpperCase() : "N/A").append("\n\n");
            
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("SHIPPING INFORMATION\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("Name: ").append(userName).append("\n");
            if (phoneNumber != null && !phoneNumber.isEmpty()) {
                emailBody.append("Phone: ").append(phoneNumber).append("\n");
            }
            if (address != null && !address.isEmpty()) {
                emailBody.append("Address: ").append(address).append("\n");
            }
            emailBody.append("\n");
            
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("WHAT'S NEXT?\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("• You can track your order status in your dashboard\n");
            emailBody.append("• View order details: ").append(frontendUrl).append("/user/orders/").append(orderId).append("\n");
            emailBody.append("• We'll notify you when your order is shipped\n\n");
            
            emailBody.append("If you have any questions, please don't hesitate to contact us.\n\n");
            emailBody.append("Thank you for shopping with MediTrack!\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("MediTrack Team");
            
            message.setText(emailBody.toString());
            mailSender.send(message);
            log.info("Order confirmation email sent successfully to: {} for order #{}", toEmail, orderId);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email to: {} for order #{}", toEmail, orderId, e);
            // Don't throw exception for order notifications - order should still be created
        }
    }

    public void sendOrderStatusUpdate(String toEmail, String userName, String orderId, String status) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediTrack - Order Status Update");
            message.setText(
                "Dear " + userName + ",\n\n" +
                "Your order status has been updated.\n\n" +
                "Order ID: #" + orderId + "\n" +
                "New Status: " + status + "\n\n" +
                "You can view more details in your dashboard.\n\n" +
                "Best regards,\n" +
                "MediTrack Team"
            );
            mailSender.send(message);
            log.info("Order status update email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send order status update to: {}", toEmail, e);
        }
    }

    public void sendVerificationStatusUpdate(String toEmail, String userName, String status, String rejectionReason) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediTrack - Account Verification Status Update");
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(userName).append(",\n\n");
            emailBody.append("Your account verification status has been updated.\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("VERIFICATION STATUS\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("Status: ").append(status).append("\n\n");
            
            if (status.equals("VERIFIED")) {
                emailBody.append("✓ Congratulations! Your account has been successfully verified.\n\n");
                emailBody.append("You can now:\n");
                emailBody.append("• List and manage medicines\n");
                emailBody.append("• Receive and process orders\n");
                emailBody.append("• Access all platform features\n\n");
                emailBody.append("Login to your account: ").append(frontendUrl).append("/login\n\n");
            } else if (status.equals("REJECTED")) {
                emailBody.append("✗ Unfortunately, your verification request has been rejected.\n\n");
                if (rejectionReason != null && !rejectionReason.isEmpty()) {
                    emailBody.append("Reason: ").append(rejectionReason).append("\n\n");
                }
                emailBody.append("Please review your documents and contact our support team for assistance.\n");
                emailBody.append("Support Email: support@meditrack.com\n\n");
            }
            
            emailBody.append("If you have any questions, please don't hesitate to contact us.\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("MediTrack Team");
            
            message.setText(emailBody.toString());
            mailSender.send(message);
            log.info("Verification status update email sent to: {} with status: {}", toEmail, status);
        } catch (Exception e) {
            log.error("Failed to send verification status update to: {}", toEmail, e);
        }
    }

    public void sendEmailVerificationCode(String toEmail, String code, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediTrack - Email Verification Code");
            
            StringBuilder emailBody = new StringBuilder();
            if (userName != null && !userName.isEmpty()) {
                emailBody.append("Dear ").append(userName).append(",\n\n");
            } else {
                emailBody.append("Hello,\n\n");
            }
            emailBody.append("Thank you for registering with MediTrack!\n\n");
            emailBody.append("Your email verification code is:\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("        ").append(code).append("\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("Please enter this code on the registration page to verify your email address.\n\n");
            emailBody.append("This code will expire in 10 minutes.\n\n");
            emailBody.append("If you did not request this code, please ignore this email.\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("MediTrack Team");
            
            message.setText(emailBody.toString());
            mailSender.send(message);
            log.info("Email verification code sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification code to: {}", toEmail, e);
            throw new RuntimeException("Failed to send verification code", e);
        }
    }

    public void sendNewOrderNotification(String toEmail, String userName, String orderId, String customerName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediTrack - New Order Received #" + orderId);
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(userName).append(",\n\n");
            emailBody.append("You have received a new order!\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("NEW ORDER NOTIFICATION\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("Order ID: #").append(orderId).append("\n");
            emailBody.append("Customer: ").append(customerName).append("\n");
            emailBody.append("Order Date: ").append(java.time.LocalDateTime.now().format(
                java.time.format.DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a"))).append("\n\n");
            emailBody.append("Please log in to your dashboard to view order details and process it.\n\n");
            emailBody.append("View Order: ").append(frontendUrl).append("/admin/orders\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("MediTrack Team");
            
            message.setText(emailBody.toString());
            mailSender.send(message);
            log.info("New order notification sent to: {} for order #{}", toEmail, orderId);
        } catch (Exception e) {
            log.error("Failed to send new order notification to: {}", toEmail, e);
        }
    }

    public void sendPasswordResetEmail(String toEmail, String token, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediTrack - Password Reset Request");
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(userName).append(",\n\n");
            emailBody.append("We received a request to reset your password for your MediTrack account.\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("PASSWORD RESET\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("Click the link below to reset your password:\n\n");
            emailBody.append(frontendUrl).append("/reset-password?token=").append(token).append("\n\n");
            emailBody.append("This link will expire in 1 hour.\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("SECURITY NOTICE\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("If you did not request this password reset, please ignore this email.\n");
            emailBody.append("Your password will remain unchanged.\n\n");
            emailBody.append("For security reasons, this link can only be used once.\n\n");
            emailBody.append("If you need assistance, please contact our support team.\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("MediTrack Team");
            
            message.setText(emailBody.toString());
            mailSender.send(message);
            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    public void sendPasswordChangeConfirmation(String toEmail, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediTrack - Password Changed Successfully");
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(userName).append(",\n\n");
            emailBody.append("This email confirms that your password has been changed successfully.\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("PASSWORD CHANGE CONFIRMATION\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("Changed At: ").append(java.time.LocalDateTime.now().format(
                java.time.format.DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a"))).append("\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("SECURITY NOTICE\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("If you did not make this change, please contact our support team immediately.\n");
            emailBody.append("Your account security is important to us.\n\n");
            emailBody.append("Support Email: support@meditrack.com\n\n");
            emailBody.append("You can now login with your new password:\n");
            emailBody.append(frontendUrl).append("/login\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("MediTrack Team");
            
            message.setText(emailBody.toString());
            mailSender.send(message);
            log.info("Password change confirmation sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password change confirmation to: {}", toEmail, e);
            // Don't throw exception - password already changed
        }
    }

    public void sendOrderCancellationConfirmation(String toEmail, String userName, String orderId, String reason) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediTrack - Order Cancelled Successfully");
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(userName).append(",\n\n");
            emailBody.append("Your order has been cancelled successfully.\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("ORDER CANCELLATION CONFIRMATION\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("Order ID: #").append(orderId).append("\n");
            emailBody.append("Cancelled At: ").append(java.time.LocalDateTime.now().format(
                java.time.format.DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a"))).append("\n\n");
            emailBody.append("Cancellation Reason:\n");
            emailBody.append(reason).append("\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("REFUND INFORMATION\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("If you paid online, your refund will be processed within 5-7 business days.\n");
            emailBody.append("For any questions, please contact our support team.\n\n");
            emailBody.append("Support Email: support@meditrack.com\n\n");
            emailBody.append("Browse more medicines:\n");
            emailBody.append(frontendUrl).append("/pharmacy/medicines\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("MediTrack Team");
            
            message.setText(emailBody.toString());
            mailSender.send(message);
            log.info("Order cancellation confirmation sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send order cancellation confirmation to: {}", toEmail, e);
            throw new RuntimeException("Failed to send cancellation confirmation email", e);
        }
    }

    public void sendOrderCancellationNotification(String toEmail, String adminName, String orderId, 
                                                   String customerName, String reason) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediTrack - Order #" + orderId + " Cancelled by Customer");
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(adminName).append(",\n\n");
            emailBody.append("A customer has cancelled their order.\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("ORDER CANCELLATION NOTIFICATION\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("Order ID: #").append(orderId).append("\n");
            emailBody.append("Customer: ").append(customerName).append("\n");
            emailBody.append("Cancelled At: ").append(java.time.LocalDateTime.now().format(
                java.time.format.DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a"))).append("\n\n");
            emailBody.append("Cancellation Reason:\n");
            emailBody.append(reason).append("\n\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("ACTION REQUIRED\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            emailBody.append("• Stock has been automatically restored\n");
            emailBody.append("• Review the cancellation reason for insights\n");
            emailBody.append("• Process any refunds if applicable\n\n");
            emailBody.append("View order details:\n");
            emailBody.append(frontendUrl).append("/admin/orders\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("MediTrack System");
            
            message.setText(emailBody.toString());
            mailSender.send(message);
            log.info("Order cancellation notification sent to admin: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send order cancellation notification to admin: {}", toEmail, e);
            // Don't throw exception - order already cancelled
        }
    }
    
    public void sendLowStockAlert(String toEmail, String pharmacyName, java.util.List<?> items) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("🔴 Low Stock Alert - Immediate Action Required");
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(pharmacyName).append(",\n\n");
            emailBody.append("⚠️ LOW STOCK ALERT ⚠️\n\n");
            emailBody.append("The following medicines in your inventory are running low:\n\n");
            
            for (Object item : items) {
                try {
                    java.lang.reflect.Field nameField = item.getClass().getField("name");
                    java.lang.reflect.Field quantityField = item.getClass().getField("quantity");
                    java.lang.reflect.Field batchField = item.getClass().getField("batchNumber");
                    
                    String name = (String) nameField.get(item);
                    int quantity = (int) quantityField.get(item);
                    String batch = (String) batchField.get(item);
                    
                    emailBody.append("• ").append(name)
                            .append(" (Batch: ").append(batch).append(")")
                            .append(" - Only ").append(quantity).append(" units remaining\n");
                } catch (Exception e) {
                    log.warn("Error processing item in low stock alert", e);
                }
            }
            
            emailBody.append("\n📋 Recommended Actions:\n");
            emailBody.append("1. Review your inventory dashboard immediately\n");
            emailBody.append("2. Place orders for low stock items\n");
            emailBody.append("3. Update your minimum stock levels if needed\n\n");
            emailBody.append("View your inventory: ").append(frontendUrl).append("/pharmacy/inventory\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("MediTrack Inventory Management System");
            
            message.setText(emailBody.toString());
            mailSender.send(message);
            log.info("Low stock alert sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send low stock alert to: {}", toEmail, e);
        }
    }
    
    public void sendExpiringMedicinesAlert(String toEmail, String pharmacyName, java.util.List<?> items, int warningDays) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("⏰ Medicines Expiring Soon - Action Required");
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(pharmacyName).append(",\n\n");
            emailBody.append("⚠️ EXPIRY WARNING ⚠️\n\n");
            emailBody.append("The following medicines will expire within the next ").append(warningDays).append(" days:\n\n");
            
            for (Object item : items) {
                try {
                    java.lang.reflect.Field nameField = item.getClass().getField("name");
                    java.lang.reflect.Field quantityField = item.getClass().getField("quantity");
                    java.lang.reflect.Field batchField = item.getClass().getField("batchNumber");
                    java.lang.reflect.Field expiryField = item.getClass().getField("expiryDate");
                    java.lang.reflect.Method daysMethod = item.getClass().getMethod("getDaysUntilExpiry");
                    
                    String name = (String) nameField.get(item);
                    int quantity = (int) quantityField.get(item);
                    String batch = (String) batchField.get(item);
                    Object expiryDate = expiryField.get(item);
                    long daysUntilExpiry = (long) daysMethod.invoke(item);
                    
                    emailBody.append("• ").append(name)
                            .append(" (Batch: ").append(batch).append(")")
                            .append(" - Expires in ").append(daysUntilExpiry).append(" days")
                            .append(" (").append(quantity).append(" units)\n");
                } catch (Exception e) {
                    log.warn("Error processing item in expiring medicines alert", e);
                }
            }
            
            emailBody.append("\n📋 Recommended Actions:\n");
            emailBody.append("1. Review expiring medicines in your inventory\n");
            emailBody.append("2. Prioritize dispensing these items\n");
            emailBody.append("3. Plan promotions or discounts to move stock\n");
            emailBody.append("4. Remove and properly dispose of any expired items\n\n");
            emailBody.append("View expiring medicines: ").append(frontendUrl).append("/pharmacy/inventory?filter=near_expiry\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("MediTrack Inventory Management System");
            
            message.setText(emailBody.toString());
            mailSender.send(message);
            log.info("Expiring medicines alert sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send expiring medicines alert to: {}", toEmail, e);
        }
    }
    
    public void sendExpiredMedicinesAlert(String toEmail, String pharmacyName, java.util.List<?> items) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("🚨 URGENT: Expired Medicines in Inventory");
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(pharmacyName).append(",\n\n");
            emailBody.append("🚨 CRITICAL ALERT 🚨\n\n");
            emailBody.append("The following medicines in your inventory have EXPIRED:\n\n");
            
            for (Object item : items) {
                try {
                    java.lang.reflect.Field nameField = item.getClass().getField("name");
                    java.lang.reflect.Field quantityField = item.getClass().getField("quantity");
                    java.lang.reflect.Field batchField = item.getClass().getField("batchNumber");
                    java.lang.reflect.Field expiryField = item.getClass().getField("expiryDate");
                    
                    String name = (String) nameField.get(item);
                    int quantity = (int) quantityField.get(item);
                    String batch = (String) batchField.get(item);
                    Object expiryDate = expiryField.get(item);
                    
                    emailBody.append("• ").append(name)
                            .append(" (Batch: ").append(batch).append(")")
                            .append(" - Expired on ").append(expiryDate)
                            .append(" (").append(quantity).append(" units)\n");
                } catch (Exception e) {
                    log.warn("Error processing item in expired medicines alert", e);
                }
            }
            
            emailBody.append("\n⚠️ IMMEDIATE ACTIONS REQUIRED:\n");
            emailBody.append("1. Remove expired medicines from accessible inventory immediately\n");
            emailBody.append("2. Mark these items as disposed in your system\n");
            emailBody.append("3. Follow proper disposal protocols for pharmaceutical waste\n");
            emailBody.append("4. Document the disposal according to regulations\n\n");
            emailBody.append("WARNING: Dispensing expired medicines is illegal and dangerous!\n\n");
            emailBody.append("View expired medicines: ").append(frontendUrl).append("/pharmacy/inventory?filter=expired\n\n");
            emailBody.append("Best regards,\n");
            emailBody.append("MediTrack Inventory Management System");
            
            message.setText(emailBody.toString());
            mailSender.send(message);
            log.info("Expired medicines alert sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send expired medicines alert to: {}", toEmail, e);
        }
    }
}







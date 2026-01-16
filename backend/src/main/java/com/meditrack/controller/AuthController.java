package com.meditrack.controller;

import com.meditrack.dto.AuthRequest;
import com.meditrack.dto.AuthResponse;
import com.meditrack.dto.UserDto;
import com.meditrack.entity.EmailVerificationToken;
import com.meditrack.entity.PasswordResetToken;
import com.meditrack.entity.User;
import com.meditrack.repository.EmailVerificationTokenRepository;
import com.meditrack.repository.PasswordResetTokenRepository;
import com.meditrack.repository.UserRepository;
import com.meditrack.service.EmailService;
import com.meditrack.service.JwtService;
import com.meditrack.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;
    private final EmailVerificationTokenRepository tokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.meditrack.service.VerificationCodeService verificationCodeService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        try {
            User savedUser = userService.register(user);
            UserDto userDto = UserDto.fromEntity(savedUser);
            return ResponseEntity.ok(userDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // No verification checks at login - email is verified during registration
            // Account verification by admin is only checked when adding medicines, not at login
            
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtService.generateToken(userDetails);
            
            // Send login notification email
            try {
                String loginTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                emailService.sendLoginNotification(user.getEmail(), user.getFullName(), loginTime);
            } catch (Exception e) {
                // Don't fail login if email fails
                System.err.println("Failed to send login notification: " + e.getMessage());
            }
            
            AuthResponse response = new AuthResponse(token, UserDto.fromEntity(user));
            return ResponseEntity.ok(response);
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            boolean verified = userService.verifyEmail(token);
            if (verified) {
                return ResponseEntity.ok(java.util.Map.of("message", "Email verified successfully"));
            } else {
                return ResponseEntity.badRequest().body(java.util.Map.of("message", "Invalid or expired verification token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Verification failed: " + e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody java.util.Map<String, String> request) {
        try {
            String email = request.get("email");
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (user.getEmailVerified()) {
                return ResponseEntity.badRequest().body(java.util.Map.of("message", "Email already verified"));
            }
            
            // Generate new token
            String token = userService.generateVerificationToken();
            EmailVerificationToken verificationToken = new EmailVerificationToken();
            verificationToken.setToken(token);
            verificationToken.setUser(user);
            verificationToken.setExpiryDate(LocalDateTime.now().plusDays(1));
            verificationToken.setUsed(false);
            tokenRepository.save(verificationToken);
            
            emailService.sendVerificationEmail(user.getEmail(), token, user.getFullName());
            return ResponseEntity.ok(java.util.Map.of("message", "Verification email sent"));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Failed to resend verification: " + e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(UserDto.fromEntity(user));
    }

    @PostMapping("/send-verification-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody java.util.Map<String, String> request) {
        try {
            String email = request.get("email");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("message", "Email is required"));
            }
            
            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("message", "Email already registered"));
            }
            
            // Generate 6-digit code on backend
            String code = String.format("%06d", (int)(Math.random() * 1000000));
            
            // Store code with 10 minute expiry
            verificationCodeService.storeCode(email, code, 10);
            
            // Send verification code email
            emailService.sendEmailVerificationCode(email, code, null);
            
            return ResponseEntity.ok(java.util.Map.of(
                "message", "Verification code sent successfully",
                "email", email
            ));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Failed to send verification code: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody java.util.Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");
            
            if (email == null || code == null) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of(
                            "verified", false,
                            "message", "Email and code are required"
                        ));
            }
            
            // Verify the code using the service
            boolean isValid = verificationCodeService.verifyCode(email, code);
            
            if (isValid) {
                return ResponseEntity.ok(java.util.Map.of(
                    "verified", true,
                    "message", "Email verified successfully"
                ));
            } else {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of(
                            "verified", false,
                            "message", "Invalid or expired verification code"
                        ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of(
                        "verified", false,
                        "message", "Verification failed: " + e.getMessage()
                    ));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        try {
            String email = request.get("email");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("message", "Email is required"));
            }
            
            // Check if user exists
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("If an account exists with this email, you will receive a password reset link"));
            
            // Generate unique token
            String token = UUID.randomUUID().toString();
            
            // Delete any existing tokens for this user
            passwordResetTokenRepository.deleteByUser(user);
            
            // Create new reset token (expires in 1 hour)
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(user);
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
            resetToken.setUsed(false);
            passwordResetTokenRepository.save(resetToken);
            
            // Send password reset email
            emailService.sendPasswordResetEmail(user.getEmail(), token, user.getFullName());
            
            return ResponseEntity.ok(java.util.Map.of(
                "message", "If an account exists with this email, you will receive a password reset link"
            ));
        } catch (Exception e) {
            // Return generic message for security (don't reveal if email exists)
            return ResponseEntity.ok(java.util.Map.of(
                "message", "If an account exists with this email, you will receive a password reset link"
            ));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("password");
            
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("message", "Reset token is required"));
            }
            
            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("message", "Password must be at least 6 characters long"));
            }
            
            // Find token
            PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));
            
            // Check if token is expired
            if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("message", "Reset token has expired. Please request a new one"));
            }
            
            // Check if token has been used
            if (resetToken.getUsed()) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("message", "Reset token has already been used. Please request a new one"));
            }
            
            // Update user password
            User user = resetToken.getUser();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            
            // Mark token as used
            resetToken.setUsed(true);
            resetToken.setUsedAt(LocalDateTime.now());
            passwordResetTokenRepository.save(resetToken);
            
            // Send confirmation email
            emailService.sendPasswordChangeConfirmation(user.getEmail(), user.getFullName());
            
            return ResponseEntity.ok(java.util.Map.of(
                "message", "Password has been reset successfully. You can now login with your new password"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Failed to reset password: " + e.getMessage()));
        }
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        try {
            PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid reset token"));
            
            if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("valid", false, "message", "Token has expired"));
            }
            
            if (resetToken.getUsed()) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("valid", false, "message", "Token has already been used"));
            }
            
            return ResponseEntity.ok(java.util.Map.of(
                "valid", true,
                "message", "Token is valid",
                "email", resetToken.getUser().getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("valid", false, "message", "Invalid token"));
        }
    }
}


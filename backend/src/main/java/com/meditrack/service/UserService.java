package com.meditrack.service;

import com.meditrack.dto.UserDto;
import com.meditrack.entity.EmailVerificationToken;
import com.meditrack.entity.User;
import com.meditrack.repository.EmailVerificationTokenRepository;
import com.meditrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationTokenRepository tokenRepository;
    private final EmailService emailService;

    @Transactional
    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // For USER role, auto-generate organization name and license number if not provided
        if (user.getRole() == User.Role.USER) {
            if (user.getOrganizationName() == null || user.getOrganizationName().trim().isEmpty()) {
                user.setOrganizationName("General User");
            }
            if (user.getLicenseNumber() == null || user.getLicenseNumber().trim().isEmpty()) {
                // Generate unique license number for USER
                String licenseNumber = "USER-" + System.currentTimeMillis();
                while (userRepository.existsByLicenseNumber(licenseNumber)) {
                    licenseNumber = "USER-" + System.currentTimeMillis();
                }
                user.setLicenseNumber(licenseNumber);
            }
        }
        
        if (userRepository.existsByLicenseNumber(user.getLicenseNumber())) {
            throw new RuntimeException("License number already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Email is already verified during registration (via 6-digit code)
        user.setEmailVerified(true);
        
        // Set verification status based on role
        if (user.getRole() == User.Role.PHARMACY || user.getRole() == User.Role.SUPPLIER) {
            user.setVerificationStatus(User.VerificationStatus.PENDING);
            // If legal document is provided during registration, it's already set
            // If not provided, it will remain null and can be uploaded later
        } else {
            user.setVerificationStatus(User.VerificationStatus.VERIFIED); // General users don't need legal verification
        }
        
        User savedUser = userRepository.save(user);
        
        // Email verification is already done via 6-digit code during registration
        // No need to send another verification email
        
        return savedUser;
    }

    public String generateVerificationToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    @Transactional
    public boolean verifyEmail(String token) {
        Optional<EmailVerificationToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty() || tokenOpt.get().getUsed()) {
            return false;
        }
        
        EmailVerificationToken verificationToken = tokenOpt.get();
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }
        
        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        
        verificationToken.setUsed(true);
        tokenRepository.save(verificationToken);
        
        return true;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDto.fromEntity(user);
    }

    public long countByRole(User.Role role) {
        return userRepository.countByRole(role);
    }
}


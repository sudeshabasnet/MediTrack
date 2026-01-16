package com.meditrack.controller;

import com.meditrack.dto.UserDto;
import com.meditrack.entity.User;
import com.meditrack.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
@PreAuthorize("hasRole('ADMIN')")
public class UserManagementController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final CartItemRepository cartItemRepository;
    private final ActivityLogRepository activityLogRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final MedicineRepository medicineRepository;
    private final com.meditrack.service.EmailService emailService;

    @GetMapping
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(required = false) User.Role role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users;

        if (role != null) {
            // Filter by role
            users = userRepository.findByRole(role, pageable);
            
            // If search is provided, further filter the results
            if (search != null && !search.isEmpty()) {
                String searchLower = search.toLowerCase();
                users = users.map(user -> {
                    if (user.getEmail().toLowerCase().contains(searchLower) ||
                        (user.getFullName() != null && user.getFullName().toLowerCase().contains(searchLower)) ||
                        (user.getOrganizationName() != null && user.getOrganizationName().toLowerCase().contains(searchLower))) {
                        return user;
                    }
                    return null;
                });
            }
        } else if (search != null && !search.isEmpty()) {
            // Search without role filter
            String searchLower = search.toLowerCase();
            users = userRepository.findAll(pageable).map(user -> {
                if (user.getEmail().toLowerCase().contains(searchLower) ||
                    (user.getFullName() != null && user.getFullName().toLowerCase().contains(searchLower)) ||
                    (user.getOrganizationName() != null && user.getOrganizationName().toLowerCase().contains(searchLower))) {
                    return user;
                }
                return null;
            });
        } else {
            // No filters, get all users
            users = userRepository.findAll(pageable);
        }

        Page<UserDto> result = users.map(UserDto::fromEntity);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(UserDto.fromEntity(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setOrganizationName(dto.getOrganizationName());
        user.setAddress(dto.getAddress());
        user.setRole(dto.getRole());
        
        User updated = userRepository.save(user);
        return ResponseEntity.ok(UserDto.fromEntity(updated));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<UserDto> activateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(true);
        User updated = userRepository.save(user);
        return ResponseEntity.ok(UserDto.fromEntity(updated));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<UserDto> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        User updated = userRepository.save(user);
        return ResponseEntity.ok(UserDto.fromEntity(updated));
    }

    @PutMapping("/{id}/verify-email")
    public ResponseEntity<UserDto> verifyUserEmail(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmailVerified(true);
        User updated = userRepository.save(user);
        return ResponseEntity.ok(UserDto.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Prevent deleting admin users
            if (user.getRole() == User.Role.ADMIN) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Cannot delete admin users"));
            }
            
            // Delete all associated records in proper order
            // 1. Delete cart items
            cartItemRepository.deleteByUser(user);
            
            // 2. Delete email verification tokens
            emailVerificationTokenRepository.deleteByUser_Id(id);
            
            // 3. Delete reviews
            List<com.meditrack.entity.Review> reviews = reviewRepository.findByUser(user);
            reviewRepository.deleteAll(reviews);
            
            // 4. Delete activity logs
            Page<com.meditrack.entity.ActivityLog> logsPage = activityLogRepository.findByUserIdOrderByCreatedAtDesc(id, Pageable.unpaged());
            List<com.meditrack.entity.ActivityLog> logs = logsPage.getContent();
            if (!logs.isEmpty()) {
                activityLogRepository.deleteAll(logs);
            }
            
            // 5. Delete orders (cascade will handle order items)
            List<com.meditrack.entity.Order> orders = orderRepository.findByUser(user);
            orderRepository.deleteAll(orders);
            
            // 6. Handle medicines if user is a supplier
            if (user.getRole() == User.Role.SUPPLIER) {
                List<com.meditrack.entity.Medicine> medicines = medicineRepository.findBySupplier(user, Pageable.unpaged()).getContent();
                // Delete medicines or reassign - for now, delete them
                medicineRepository.deleteAll(medicines);
            }
            
            // 7. Finally delete the user
            userRepository.deleteById(id);
            
            return ResponseEntity.ok(Map.of("message", "User and all associated records deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to delete user: " + e.getMessage()));
        }
    }

    @GetMapping("/roles/{role}")
    public ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable User.Role role) {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> user.getRole() == role)
                .collect(Collectors.toList());
        List<UserDto> result = users.stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/verification")
    public ResponseEntity<?> updateVerificationStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> request) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String status = request.get("status");
            String rejectionReason = request.get("rejectionReason");
            
            if (status == null || (!status.equals("VERIFIED") && !status.equals("REJECTED"))) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid status. Must be VERIFIED or REJECTED"));
            }
            
            User.VerificationStatus verificationStatus = User.VerificationStatus.valueOf(status);
            user.setVerificationStatus(verificationStatus);
            User updatedUser = userRepository.save(user);
            
            // Send email notification
            try {
                emailService.sendVerificationStatusUpdate(
                    user.getEmail(), 
                    user.getFullName(), 
                    status,
                    rejectionReason
                );
            } catch (Exception e) {
                // Log error but don't fail the verification update
                System.err.println("Failed to send verification email: " + e.getMessage());
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "Verification status updated successfully",
                "user", UserDto.fromEntity(updatedUser)
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to update verification status: " + e.getMessage()));
        }
    }
}




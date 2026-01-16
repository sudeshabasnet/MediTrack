package com.meditrack.controller;

import com.meditrack.dto.MedicineDto;
import com.meditrack.dto.OrderDto;
import com.meditrack.entity.Medicine;
import com.meditrack.entity.Order;
import com.meditrack.entity.User;
import com.meditrack.repository.MedicineRepository;
import com.meditrack.repository.OrderRepository;
import com.meditrack.repository.UserRepository;
import com.meditrack.service.MedicineService;
import com.meditrack.service.UserService;
import com.meditrack.service.ActivityLogService;
import com.meditrack.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final MedicineService medicineService;
    private final UserService userService;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final com.meditrack.repository.OrderItemRepository orderItemRepository;
    private final com.meditrack.service.ExportService exportService;
    private final ActivityLogService activityLogService;
    private final EmailService emailService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(Principal principal) {
        Map<String, Object> response = new HashMap<>();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalMedicines", medicineRepository.count());
        stats.put("totalSuppliers", userService.countByRole(User.Role.SUPPLIER));
        stats.put("totalPharmacies", userService.countByRole(User.Role.PHARMACY));
        stats.put("lowStockMedicines", (long) medicineRepository.findLowStockMedicines().size());
        stats.put("nearExpiryMedicines", (long) medicineRepository
                .findNearExpiryMedicines(java.time.LocalDate.now().plusDays(30)).size());
        stats.put("pendingVerifications",
                (long) userRepository.findByVerificationStatus(User.VerificationStatus.PENDING).size());

        response.put("stats", stats);

        // Get recent activities
        var recentActivities = activityLogService.getAllActivities(
                org.springframework.data.domain.PageRequest.of(0, 10))
                .getContent().stream()
                .map(activity -> {
                    Map<String, Object> activityMap = new HashMap<>();
                    activityMap.put("action", activity.getAction());
                    activityMap.put("description", activity.getDescription());
                    activityMap.put("timestamp", activity.getCreatedAt().toString());
                    activityMap.put("user", activity.getUser().getFullName());
                    return activityMap;
                })
                .collect(java.util.stream.Collectors.toList());

        response.put("recentActivities", recentActivities);

        // Top medicines (placeholder - can be enhanced with usage statistics)
        response.put("topMedicines", java.util.Collections.emptyList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/medicines")
    public ResponseEntity<Page<MedicineDto>> getMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Medicine.Status status,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MedicineDto> medicines = medicineService.searchMedicines(
                search, category, status, supplierId, pageable);
        return ResponseEntity.ok(medicines);
    }

    @GetMapping("/medicines/{id}")
    public ResponseEntity<MedicineDto> getMedicine(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @PostMapping("/medicines")
    public ResponseEntity<MedicineDto> createMedicine(@RequestBody MedicineDto dto) {
        Medicine medicine = medicineService.createMedicine(dto, dto.getSupplierId());
        return ResponseEntity.ok(MedicineDto.fromEntity(medicine));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<MedicineDto> updateMedicine(
            @PathVariable Long id, @RequestBody MedicineDto dto) {
        Medicine medicine = medicineService.updateMedicine(id, dto);
        return ResponseEntity.ok(MedicineDto.fromEntity(medicine));
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/medicines/export")
    public ResponseEntity<byte[]> exportMedicines(@RequestParam String format) {
        try {
            byte[] data;
            String contentType;
            String filename;

            if ("csv".equalsIgnoreCase(format)) {
                data = exportService.exportToCsv();
                contentType = "text/csv";
                filename = "medicines.csv";
            } else if ("pdf".equalsIgnoreCase(format)) {
                data = exportService.exportToPdf();
                contentType = "application/pdf";
                filename = "medicines.pdf";
            } else {
                return ResponseEntity.badRequest().build();
            }

            return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .body(data);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/users/pending-verification")
    public ResponseEntity<java.util.List<Map<String, Object>>> getPendingVerifications() {
        java.util.List<User> pendingUsers = userRepository.findByVerificationStatus(User.VerificationStatus.PENDING);
        // Filter to only include SUPPLIER and PHARMACY roles
        java.util.List<Map<String, Object>> result = pendingUsers.stream()
                .filter(user -> user.getRole() == User.Role.SUPPLIER || user.getRole() == User.Role.PHARMACY)
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("fullName", user.getFullName());
                    userMap.put("email", user.getEmail());
                    userMap.put("role", user.getRole());
                    userMap.put("organizationName", user.getOrganizationName());
                    userMap.put("licenseNumber", user.getLicenseNumber());
                    userMap.put("legalDocumentUrl", user.getLegalDocumentUrl());
                    userMap.put("verificationStatus", user.getVerificationStatus());
                    userMap.put("emailVerified", user.getEmailVerified());
                    userMap.put("active", user.getActive());
                    userMap.put("createdAt", user.getCreatedAt());
                    return userMap;
                })
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/users/{id}/verify")
    public ResponseEntity<?> verifyUser(@PathVariable Long id, @RequestBody Map<String, String> request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String action = request.get("action"); // "approve" or "reject"
        if (action == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Action is required"));
        }

        if ("approve".equalsIgnoreCase(action)) {
            user.setVerificationStatus(User.VerificationStatus.VERIFIED);
            userRepository.save(user);

            // Send verification success email
            try {
                emailService.sendVerificationStatusUpdate(user.getEmail(), user.getFullName(), "VERIFIED", null);
            } catch (Exception e) {
                System.err.println("Failed to send verification email: " + e.getMessage());
            }

            return ResponseEntity.ok(Map.of("message", "User verified successfully"));
        } else if ("reject".equalsIgnoreCase(action)) {
            user.setVerificationStatus(User.VerificationStatus.REJECTED);
            userRepository.save(user);

            // Send rejection email
            try {
                emailService.sendVerificationStatusUpdate(user.getEmail(), user.getFullName(), "REJECTED", null);
            } catch (Exception e) {
                System.err.println("Failed to send rejection email: " + e.getMessage());
            }

            return ResponseEntity.ok(Map.of("message", "User verification rejected"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid action. Use 'approve' or 'reject'"));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<java.util.List<OrderDto>> getAllOrders(
            @RequestParam(required = false) String status) {
        java.util.List<Order> orders;
        try {
            if (status != null && !status.isEmpty()) {
                orders = orderRepository.findByStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
            } else {
                orders = orderRepository.findAll();
            }
            // Sort by created date descending
            orders.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
            java.util.List<OrderDto> orderDtos = orders.stream()
                    .map(OrderDto::fromEntity)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(orderDtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderDto> getOrderDetails(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return ResponseEntity.ok(OrderDto.fromEntity(order));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody java.util.Map<String, String> statusUpdate) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Check if order is in a final state (CANCELLED or DELIVERED)
        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("error", "Cannot change status of a cancelled order"));
        }
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("error", "Cannot change status of a delivered order"));
        }

        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(statusUpdate.get("status").toUpperCase());

            // If cancelling the order, restore stock
            if (newStatus == Order.OrderStatus.CANCELLED) {
                restoreStock(order);
            }

            order.setStatus(newStatus);
            order.setUpdatedAt(java.time.LocalDateTime.now());
            orderRepository.save(order);

            // Send email notification to customer
            try {
                String customerEmail = order.getEmail() != null ? order.getEmail()
                        : (order.getUser() != null ? order.getUser().getEmail() : null);
                String customerName = order.getUser() != null ? order.getUser().getFullName() : order.getFullName();

                if (customerEmail != null) {
                    emailService.sendOrderStatusUpdate(
                            customerEmail,
                            customerName,
                            order.getId().toString(),
                            getStatusDisplayName(newStatus));
                }
            } catch (Exception e) {
                // Log but don't fail the status update if email fails
                System.err.println("Failed to send status update email: " + e.getMessage());
            }

            return ResponseEntity.ok(OrderDto.fromEntity(order));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("error", "Invalid status value"));
        }
    }

    private String getStatusDisplayName(Order.OrderStatus status) {
        switch (status) {
            case PENDING:
                return "Pending";
            case CONFIRMED:
                return "Confirmed";
            case PROCESSING:
                return "Processing/Packaging";
            case SHIPPED:
                return "Shipped/Delivering";
            case DELIVERED:
                return "Delivered";
            case CANCELLED:
                return "Cancelled";
            default:
                return status.toString();
        }
    }

    private void restoreStock(Order order) {
        // Get all order items for this order
        java.util.List<com.meditrack.entity.OrderItem> orderItems = orderItemRepository.findAll().stream()
                .filter(item -> item.getOrder().getId().equals(order.getId()))
                .collect(java.util.stream.Collectors.toList());

        // Restore stock for each medicine
        for (com.meditrack.entity.OrderItem orderItem : orderItems) {
            com.meditrack.entity.Medicine medicine = orderItem.getMedicine();
            int restoredStock = medicine.getCurrentStock() + orderItem.getQuantity();
            medicine.setCurrentStock(restoredStock);
            medicineRepository.save(medicine);

            System.out.println("Stock restored for medicine: " + medicine.getName() +
                    " | Quantity restored: " + orderItem.getQuantity() +
                    " | New stock: " + restoredStock);
        }
    }
}

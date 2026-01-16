package com.meditrack.controller;

import com.meditrack.dto.MedicineDto;
import com.meditrack.entity.Medicine;
import com.meditrack.entity.User;
import com.meditrack.entity.Order;
import com.meditrack.entity.OrderItem;
import com.meditrack.repository.MedicineRepository;
import com.meditrack.repository.UserRepository;
import com.meditrack.repository.OrderItemRepository;
import com.meditrack.repository.OrderRepository;
import com.meditrack.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/supplier")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
@PreAuthorize("hasRole('SUPPLIER')")
public class SupplierController {
    private final MedicineService medicineService;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final com.meditrack.service.EmailService emailService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(Principal principal) {
        User supplier = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> stats = new HashMap<>();

        List<Medicine> medicines = medicineRepository.findBySupplier(supplier, null).getContent();
        long totalMedicines = medicines.size();
        long lowStock = medicines.stream()
                .filter(m -> m.getCurrentStock() <= m.getMinStockLevel())
                .count();
        long nearExpiry = medicines.stream()
                .filter(m -> m.getExpiryDate().isBefore(java.time.LocalDate.now().plusDays(30)))
                .count();
        double totalStockValue = medicines.stream()
                .mapToDouble(m -> m.getCurrentStock() * m.getUnitPrice().doubleValue())
                .sum();

        stats.put("totalMedicines", totalMedicines);
        stats.put("lowStockMedicines", lowStock);
        stats.put("nearExpiryMedicines", nearExpiry);
        stats.put("totalStockValue", totalStockValue);

        response.put("stats", stats);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/medicines")
    public ResponseEntity<List<MedicineDto>> getMyMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Medicine.Status status,
            Principal principal) {
        User supplier = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0,
                Integer.MAX_VALUE);
        List<Medicine> medicines = medicineRepository.findBySupplier(supplier, pageable).getContent();

        List<Medicine> filtered = medicines.stream()
                .filter(m -> search == null ||
                        m.getName().toLowerCase().contains(search.toLowerCase()) ||
                        m.getBatchNumber().toLowerCase().contains(search.toLowerCase()))
                .filter(m -> category == null || m.getCategory().equals(category))
                .filter(m -> status == null || m.getStatus() == status)
                .collect(Collectors.toList());

        List<MedicineDto> result = filtered.stream()
                .map(MedicineDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/medicines/{id}")
    public ResponseEntity<MedicineDto> getMedicine(@PathVariable Long id, Principal principal) {
        User supplier = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        if (!medicine.getSupplier().getId().equals(supplier.getId())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(MedicineDto.fromEntity(medicine));
    }

    @PostMapping("/medicines")
    public ResponseEntity<MedicineDto> createMedicine(@RequestBody MedicineDto dto, Principal principal) {
        User supplier = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Medicine medicine = medicineService.createMedicine(dto, supplier.getId());
        return ResponseEntity.ok(MedicineDto.fromEntity(medicine));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<MedicineDto> updateMedicine(
            @PathVariable Long id, @RequestBody MedicineDto dto, Principal principal) {
        User supplier = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        if (!medicine.getSupplier().getId().equals(supplier.getId())) {
            return ResponseEntity.status(403).build();
        }

        Medicine updated = medicineService.updateMedicine(id, dto);
        return ResponseEntity.ok(MedicineDto.fromEntity(updated));
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id, Principal principal) {
        User supplier = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        if (!medicine.getSupplier().getId().equals(supplier.getId())) {
            return ResponseEntity.status(403).build();
        }

        medicineService.deleteMedicine(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Map<String, Object>>> getSupplierOrders(Principal principal) {
        User supplier = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get all medicines supplied by this supplier
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0,
                Integer.MAX_VALUE);
        List<Medicine> supplierMedicines = medicineRepository.findBySupplier(supplier, pageable).getContent();
        List<Long> medicineIds = supplierMedicines.stream().map(Medicine::getId).collect(Collectors.toList());

        if (medicineIds.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        // Get all order items for these medicines
        List<OrderItem> orderItems = orderItemRepository.findAll().stream()
                .filter(item -> medicineIds.contains(item.getMedicine().getId()))
                .collect(Collectors.toList());

        // Group by order and create response
        Map<Long, Order> uniqueOrders = new HashMap<>();
        Map<Long, Integer> orderItemCounts = new HashMap<>();
        Map<Long, OrderItem> firstOrderItems = new HashMap<>();

        for (OrderItem item : orderItems) {
            Order order = item.getOrder();
            Long orderId = order.getId();
            uniqueOrders.put(orderId, order);
            orderItemCounts.put(orderId, orderItemCounts.getOrDefault(orderId, 0) + 1);
            // Store first item for each order to show medicine preview
            if (!firstOrderItems.containsKey(orderId)) {
                firstOrderItems.put(orderId, item);
            }
        }

        List<Map<String, Object>> response = uniqueOrders.values().stream()
                .map(order -> {
                    Map<String, Object> orderMap = new HashMap<>();
                    orderMap.put("id", order.getId());
                    orderMap.put("customerName", order.getFullName());
                    orderMap.put("itemCount", orderItemCounts.get(order.getId()));
                    orderMap.put("totalAmount", order.getTotalAmount());
                    orderMap.put("status", order.getStatus().toString());
                    orderMap.put("createdAt", order.getCreatedAt());
                    orderMap.put("address", order.getAddress());
                    orderMap.put("phoneNumber", order.getPhoneNumber());
                    orderMap.put("paymentMethod", order.getPaymentMethod());

                    // Add first medicine info for preview
                    OrderItem firstItem = firstOrderItems.get(order.getId());
                    if (firstItem != null) {
                        Map<String, Object> medicineInfo = new HashMap<>();
                        medicineInfo.put("name", firstItem.getMedicine().getName());
                        medicineInfo.put("genericName", firstItem.getMedicine().getGenericName());
                        medicineInfo.put("imageUrl", firstItem.getMedicine().getImageUrl());
                        orderMap.put("firstMedicine", medicineInfo);
                    }

                    return orderMap;
                })
                .sorted((o1, o2) -> ((java.time.LocalDateTime) o2.get("createdAt"))
                        .compareTo((java.time.LocalDateTime) o1.get("createdAt")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderDetails(@PathVariable Long orderId, Principal principal) {
        User supplier = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get the order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Get all medicines supplied by this supplier
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0,
                Integer.MAX_VALUE);
        List<Medicine> supplierMedicines = medicineRepository.findBySupplier(supplier, pageable).getContent();
        List<Long> medicineIds = supplierMedicines.stream().map(Medicine::getId).collect(Collectors.toList());

        // Get order items that belong to this supplier
        List<OrderItem> supplierOrderItems = orderItemRepository.findAll().stream()
                .filter(item -> item.getOrder().getId().equals(orderId))
                .filter(item -> medicineIds.contains(item.getMedicine().getId()))
                .collect(Collectors.toList());

        // If no items from this supplier, deny access
        if (supplierOrderItems.isEmpty()) {
            return ResponseEntity.status(403).build();
        }

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("id", order.getId());
        response.put("customerName", order.getFullName());
        response.put("totalAmount", order.getTotalAmount());
        response.put("status", order.getStatus().toString());
        response.put("createdAt", order.getCreatedAt());
        response.put("shippingAddress", order.getAddress());
        response.put("phoneNumber", order.getPhoneNumber());
        response.put("paymentMethod", order.getPaymentMethod());

        // Add order items with medicine details
        List<Map<String, Object>> items = new ArrayList<>();
        for (OrderItem item : supplierOrderItems) {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("id", item.getId());
            itemMap.put("quantity", item.getQuantity());
            itemMap.put("price", item.getUnitPrice());

            // Add medicine details
            Map<String, Object> medicineMap = new HashMap<>();
            medicineMap.put("id", item.getMedicine().getId());
            medicineMap.put("name", item.getMedicine().getName());
            medicineMap.put("genericName", item.getMedicine().getGenericName());
            medicineMap.put("manufacturer", item.getMedicine().getManufacturer());
            medicineMap.put("imageUrl", item.getMedicine().getImageUrl());
            itemMap.put("medicine", medicineMap);

            items.add(itemMap);
        }
        response.put("items", items);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> statusUpdate,
            Principal principal) {
        User supplier = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get the order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Check if order is in a final state (CANCELLED or DELIVERED)
        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Cannot change status of a cancelled order");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Cannot change status of a delivered order");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Verify the supplier has items in this order
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0,
                Integer.MAX_VALUE);
        List<Medicine> supplierMedicines = medicineRepository.findBySupplier(supplier, pageable).getContent();
        List<Long> medicineIds = supplierMedicines.stream().map(Medicine::getId).collect(Collectors.toList());

        List<OrderItem> supplierOrderItems = orderItemRepository.findAll().stream()
                .filter(item -> item.getOrder().getId().equals(orderId))
                .filter(item -> medicineIds.contains(item.getMedicine().getId()))
                .collect(Collectors.toList());

        if (supplierOrderItems.isEmpty()) {
            return ResponseEntity.status(403).build();
        }

        // Update status
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

            Map<String, Object> response = new HashMap<>();
            response.put("id", order.getId());
            response.put("status", order.getStatus().toString());
            response.put("message", "Order status updated successfully. Customer notified via email.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid status value");
            return ResponseEntity.badRequest().body(errorResponse);
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
        List<OrderItem> orderItems = orderItemRepository.findAll().stream()
                .filter(item -> item.getOrder().getId().equals(order.getId()))
                .collect(Collectors.toList());

        // Restore stock for each medicine
        for (OrderItem orderItem : orderItems) {
            Medicine medicine = orderItem.getMedicine();
            int restoredStock = medicine.getCurrentStock() + orderItem.getQuantity();
            medicine.setCurrentStock(restoredStock);
            medicineRepository.save(medicine);

            System.out.println("Stock restored for medicine: " + medicine.getName() +
                    " | Quantity restored: " + orderItem.getQuantity() +
                    " | New stock: " + restoredStock);
        }
    }
}

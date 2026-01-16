package com.meditrack.controller;

import com.meditrack.dto.OrderDto;
import com.meditrack.entity.*;
import com.meditrack.repository.*;
import com.meditrack.service.EmailService;
import com.meditrack.service.PharmacyInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PharmacyInventoryService pharmacyInventoryService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY')")
    @Transactional
    public ResponseEntity<OrderDto> createOrder(
            @RequestBody Map<String, Object> request,
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String fullName = (String) request.get("fullName");
        String address = (String) request.get("address");
        String phoneNumber = (String) request.get("phoneNumber");
        String paymentMethod = (String) request.get("paymentMethod");
        
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        BigDecimal subtotal = cartItems.stream()
                .map(item -> item.getMedicine().getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate delivery charge based on address
        BigDecimal deliveryCharge = calculateDeliveryCharge(address);
        BigDecimal totalAmount = subtotal.add(deliveryCharge);
        
        Order order = new Order();
        order.setUser(user);
        order.setFullName(fullName);
        order.setEmail(user.getEmail()); // Set email from user
        order.setAddress(address);
        order.setPhoneNumber(phoneNumber);
        order.setSubtotal(subtotal);
        order.setDeliveryCharge(deliveryCharge);
        order.setTotalAmount(totalAmount);
        order.setPaymentMethod(paymentMethod);
        order.setStatus(Order.OrderStatus.PENDING);
        
        Order savedOrder = orderRepository.save(order);
        
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setMedicine(cartItem.getMedicine());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getMedicine().getUnitPrice());
            orderItem.setSubtotal(cartItem.getMedicine().getUnitPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            orderItemRepository.save(orderItem);
            
            // Update stock
            Medicine medicine = cartItem.getMedicine();
            medicine.setCurrentStock(medicine.getCurrentStock() - cartItem.getQuantity());
            medicineRepository.save(medicine);
        }
        
        cartItemRepository.deleteByUser(user);
        
        // Send order confirmation email to customer
        try {
            emailService.sendOrderConfirmation(
                user.getEmail(),
                user.getFullName(),
                savedOrder.getId().toString(),
                totalAmount.doubleValue(),
                paymentMethod,
                address,
                phoneNumber
            );
        } catch (Exception e) {
            // Don't fail order creation if email fails
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Send new order notification to admin
        try {
            List<User> admins = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == User.Role.ADMIN)
                    .collect(Collectors.toList());
            
            for (User admin : admins) {
                emailService.sendNewOrderNotification(
                    admin.getEmail(),
                    admin.getFullName(),
                    savedOrder.getId().toString(),
                    user.getFullName()
                );
            }
        } catch (Exception e) {
            // Don't fail order creation if email fails
            System.err.println("Failed to send admin notification email: " + e.getMessage());
        }
        
        return ResponseEntity.ok(OrderDto.fromEntity(savedOrder));
    }

    private BigDecimal calculateDeliveryCharge(String address) {
        if (address == null || address.trim().isEmpty()) {
            return BigDecimal.valueOf(100); // Default delivery charge Rs. 100
        }
        
        String addressLower = address.toLowerCase();
        
        // Within Kathmandu Valley - Rs. 100
        if (addressLower.contains("kathmandu") || 
            addressLower.contains("lalitpur") || 
            addressLower.contains("bhaktapur") ||
            addressLower.contains("ktm")) {
            return BigDecimal.valueOf(100);
        }
        
        // Nearby cities (within 50km) - Rs. 200
        if (addressLower.contains("pokhara") || 
            addressLower.contains("biratnagar") ||
            addressLower.contains("patan") ||
            addressLower.contains("kirtipur") ||
            addressLower.contains("madhyapur")) {
            return BigDecimal.valueOf(200);
        }
        
        // Mid-range cities (50-150km) - Rs. 300
        if (addressLower.contains("chitwan") ||
            addressLower.contains("butwal") ||
            addressLower.contains("hetauda") ||
            addressLower.contains("dharan")) {
            return BigDecimal.valueOf(300);
        }
        
        // Far regions - Rs. 500
        return BigDecimal.valueOf(500);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY')")
    public ResponseEntity<List<OrderDto>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        List<OrderDto> orderDtos = orders.stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(orderDtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY', 'ADMIN')")
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!user.getRole().equals(User.Role.ADMIN) && 
            !order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(OrderDto.fromEntity(order));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        String status = request.get("status");
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status);
        order.setStatus(newStatus);
        
        Order saved = orderRepository.save(order);
        
        // Add items to pharmacy inventory if order is delivered to a pharmacy
        if (newStatus == Order.OrderStatus.DELIVERED) {
            try {
                pharmacyInventoryService.addOrderItemsToInventory(saved);
            } catch (Exception e) {
                System.err.println("Failed to add items to pharmacy inventory: " + e.getMessage());
            }
        }
        
        // Send order status update email to customer
        try {
            User customer = order.getUser();
            emailService.sendOrderStatusUpdate(
                customer.getEmail(),
                customer.getFullName(),
                order.getId().toString(),
                newStatus.toString()
            );
        } catch (Exception e) {
            // Don't fail status update if email fails
            System.err.println("Failed to send order status update email: " + e.getMessage());
        }
        
        return ResponseEntity.ok(OrderDto.fromEntity(saved));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY')")
    @Transactional
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Principal principal) {
        
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Check if user owns the order
        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "You don't have permission to cancel this order"));
        }
        
        // Check if order is already cancelled or delivered
        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            return ResponseEntity.badRequest().body(Map.of("message", "Order is already cancelled"));
        }
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot cancel delivered order"));
        }
        
        // Check if order was placed within last 5 minutes
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime orderTime = order.getCreatedAt();
        long minutesSinceOrder = java.time.Duration.between(orderTime, now).toMinutes();
        
        if (minutesSinceOrder > 5) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Order can only be cancelled within 5 minutes of placement",
                "minutesElapsed", minutesSinceOrder
            ));
        }
        
        String cancellationReason = request.get("reason");
        if (cancellationReason == null || cancellationReason.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cancellation reason is required"));
        }
        
        // Restore medicine stock
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
        for (OrderItem item : orderItems) {
            Medicine medicine = item.getMedicine();
            medicine.setCurrentStock(medicine.getCurrentStock() + item.getQuantity());
            medicineRepository.save(medicine);
        }
        
        // Update order status
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancellationReason(cancellationReason);
        order.setCancelledAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);
        
        // Send email to customer
        try {
            emailService.sendOrderCancellationConfirmation(
                user.getEmail(),
                user.getFullName(),
                order.getId().toString(),
                cancellationReason
            );
        } catch (Exception e) {
            System.err.println("Failed to send cancellation email to customer: " + e.getMessage());
        }
        
        // Send email to admins
        try {
            List<User> admins = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == User.Role.ADMIN)
                    .collect(Collectors.toList());
            
            for (User admin : admins) {
                emailService.sendOrderCancellationNotification(
                    admin.getEmail(),
                    admin.getFullName(),
                    order.getId().toString(),
                    user.getFullName(),
                    cancellationReason
                );
            }
        } catch (Exception e) {
            System.err.println("Failed to send cancellation notification to admin: " + e.getMessage());
        }
        
        return ResponseEntity.ok(Map.of(
            "message", "Order cancelled successfully",
            "order", OrderDto.fromEntity(savedOrder)
        ));
    }
}




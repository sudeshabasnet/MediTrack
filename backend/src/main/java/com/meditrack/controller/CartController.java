package com.meditrack.controller;

import com.meditrack.dto.CartItemDto;
import com.meditrack.entity.CartItem;
import com.meditrack.entity.Medicine;
import com.meditrack.entity.User;
import com.meditrack.repository.CartItemRepository;
import com.meditrack.repository.MedicineRepository;
import com.meditrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class CartController {

    private final CartItemRepository cartItemRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;

    // Purchase limitations for general users (as per PRD)
    private static final int MAX_QUANTITY_PER_MEDICINE_USER = 5; // Max 5 units per medicine for general users
    private static final int MAX_TOTAL_ITEMS_USER = 20; // Max 20 total items in cart for general users

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY')")
    public ResponseEntity<List<CartItemDto>> getCart(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        List<CartItemDto> cartItemDtos = cartItems.stream()
                .map(CartItemDto::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(cartItemDtos);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY')")
    public ResponseEntity<CartItemDto> addToCart(
            @RequestBody Map<String, Object> request,
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long medicineId = Long.valueOf(request.get("medicineId").toString());
        Integer quantity = request.containsKey("quantity") 
                ? Integer.valueOf(request.get("quantity").toString()) 
                : 1;
        
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        
        if (medicine.getCurrentStock() < quantity) {
            return ResponseEntity.badRequest().body(null);
        }
        
        // Apply purchase limitations for general users
        if (user.getRole() == User.Role.USER) {
            // Check max quantity per medicine
            if (quantity > MAX_QUANTITY_PER_MEDICINE_USER) {
                return ResponseEntity.badRequest().body(null);
            }
            
            // Check total items in cart
            List<CartItem> existingCartItems = cartItemRepository.findByUser(user);
            int totalItems = existingCartItems.stream()
                    .mapToInt(CartItem::getQuantity)
                    .sum();
            if (totalItems + quantity > MAX_TOTAL_ITEMS_USER) {
                return ResponseEntity.badRequest().body(null);
            }
        }
        
        CartItem existingItem = cartItemRepository
                .findByUserAndMedicineId(user, medicineId)
                .orElse(null);
        
        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + quantity;
            
            // Check limitations again for updated quantity
            if (user.getRole() == User.Role.USER) {
                if (newQuantity > MAX_QUANTITY_PER_MEDICINE_USER) {
                    return ResponseEntity.badRequest().body(null);
                }
            }
            
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
            return ResponseEntity.ok(CartItemDto.fromEntity(existingItem));
        }
        
        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setMedicine(medicine);
        cartItem.setQuantity(quantity);
        
        CartItem saved = cartItemRepository.save(cartItem);
        return ResponseEntity.ok(CartItemDto.fromEntity(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY')")
    public ResponseEntity<CartItemDto> updateQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request,
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return ResponseEntity.ok().build();
        }
        
        if (cartItem.getMedicine().getCurrentStock() < quantity) {
            return ResponseEntity.badRequest().build();
        }
        
        // Apply purchase limitations for general users
        if (user.getRole() == User.Role.USER) {
            if (quantity > MAX_QUANTITY_PER_MEDICINE_USER) {
                return ResponseEntity.badRequest().build();
            }
        }
        
        cartItem.setQuantity(quantity);
        CartItem saved = cartItemRepository.save(cartItem);
        return ResponseEntity.ok(CartItemDto.fromEntity(saved));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY')")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        cartItemRepository.delete(cartItem);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY')")
    public ResponseEntity<Void> clearCart(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        cartItemRepository.deleteByUser(user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY')")
    public ResponseEntity<Map<String, Object>> getCartSummary(
            Principal principal,
            @RequestParam(required = false) String address) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        
        int itemCount = cartItems.size();
        int totalQuantity = cartItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
        BigDecimal subtotal = cartItems.stream()
                .map(item -> item.getMedicine().getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate delivery charge based on address/distance
        BigDecimal deliveryCharge = calculateDeliveryCharge(address);
        BigDecimal totalAmount = subtotal.add(deliveryCharge);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("itemCount", itemCount);
        summary.put("totalQuantity", totalQuantity);
        summary.put("subtotal", subtotal);
        summary.put("deliveryCharge", deliveryCharge);
        summary.put("totalAmount", totalAmount);
        
        return ResponseEntity.ok(summary);
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
}




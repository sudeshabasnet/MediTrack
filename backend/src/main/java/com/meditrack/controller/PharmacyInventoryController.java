package com.meditrack.controller;

import com.meditrack.entity.PharmacyInventory;
import com.meditrack.entity.User;
import com.meditrack.entity.Order;
import com.meditrack.repository.PharmacyInventoryRepository;
import com.meditrack.repository.UserRepository;
import com.meditrack.repository.OrderRepository;
import com.meditrack.service.PharmacyInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacy/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class PharmacyInventoryController {

    private final PharmacyInventoryRepository pharmacyInventoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PharmacyInventoryService pharmacyInventoryService;

    @GetMapping
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<List<PharmacyInventory>> getAllInventory(
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String source,
            Authentication authentication) {
        
        String email = authentication.getName();
        User pharmacy = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));

        List<PharmacyInventory> inventory;

        if (filter != null) {
            switch (filter) {
                case "low_stock":
                    inventory = pharmacyInventoryRepository.findLowStockItems(pharmacy);
                    break;
                case "near_expiry":
                    LocalDate today = LocalDate.now();
                    LocalDate thirtyDaysLater = today.plusDays(30);
                    inventory = pharmacyInventoryRepository.findExpiringItems(pharmacy, today, thirtyDaysLater);
                    break;
                case "expired":
                    inventory = pharmacyInventoryRepository.findExpiredItems(pharmacy, LocalDate.now());
                    break;
                default:
                    inventory = pharmacyInventoryRepository.findByPharmacyAndActiveTrueOrderByCreatedAtDesc(pharmacy);
            }
        } else if (category != null) {
            inventory = pharmacyInventoryRepository.findByPharmacyAndCategory(pharmacy, category);
        } else if (source != null) {
            PharmacyInventory.InventorySource inventorySource = PharmacyInventory.InventorySource.valueOf(source.toUpperCase());
            inventory = pharmacyInventoryRepository.findByPharmacyAndSourceAndActiveTrue(pharmacy, inventorySource);
        } else {
            inventory = pharmacyInventoryRepository.findByPharmacyAndActiveTrueOrderByCreatedAtDesc(pharmacy);
        }

        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<Map<String, Object>> getInventoryStats(Authentication authentication) {
        String email = authentication.getName();
        User pharmacy = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));

        List<PharmacyInventory> allInventory = pharmacyInventoryRepository.findByPharmacyAndActiveTrue(pharmacy);
        List<PharmacyInventory> lowStock = pharmacyInventoryRepository.findLowStockItems(pharmacy);
        
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysLater = today.plusDays(30);
        List<PharmacyInventory> nearExpiry = pharmacyInventoryRepository.findExpiringItems(pharmacy, today, thirtyDaysLater);
        List<PharmacyInventory> expired = pharmacyInventoryRepository.findExpiredItems(pharmacy, today);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMedicines", allInventory.size());
        stats.put("lowStock", lowStock.size());
        stats.put("nearExpiry", nearExpiry.size());
        stats.put("expired", expired.size());

        return ResponseEntity.ok(stats);
    }

    @PostMapping
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<PharmacyInventory> addInventoryItem(
            @RequestBody PharmacyInventory inventoryItem,
            Authentication authentication) {
        
        try {
            System.out.println("=== ADD INVENTORY ITEM START ===");
            System.out.println("Received inventory item: " + inventoryItem);
            
            String email = authentication.getName();
            System.out.println("Authenticated user: " + email);
            
            User pharmacy = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Pharmacy not found"));
            
            System.out.println("Found pharmacy: " + pharmacy.getFullName());

            inventoryItem.setPharmacy(pharmacy);
            inventoryItem.setSource(PharmacyInventory.InventorySource.MANUAL);
            inventoryItem.setActive(true);

            System.out.println("Saving inventory item...");
            PharmacyInventory saved = pharmacyInventoryRepository.save(inventoryItem);
            System.out.println("Successfully saved with ID: " + saved.getId());
            System.out.println("=== ADD INVENTORY ITEM END ===");
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("ERROR adding inventory item: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<PharmacyInventory> updateInventoryItem(
            @PathVariable Long id,
            @RequestBody PharmacyInventory inventoryItem,
            Authentication authentication) {
        
        String email = authentication.getName();
        User pharmacy = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));

        PharmacyInventory existing = pharmacyInventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        // Verify ownership
        if (!existing.getPharmacy().getId().equals(pharmacy.getId())) {
            return ResponseEntity.status(403).build();
        }

        // Update fields
        if (inventoryItem.getName() != null) existing.setName(inventoryItem.getName());
        if (inventoryItem.getCategory() != null) existing.setCategory(inventoryItem.getCategory());
        if (inventoryItem.getGenericName() != null) existing.setGenericName(inventoryItem.getGenericName());
        if (inventoryItem.getManufacturer() != null) existing.setManufacturer(inventoryItem.getManufacturer());
        if (inventoryItem.getDescription() != null) existing.setDescription(inventoryItem.getDescription());
        if (inventoryItem.getUnitPrice() != null) existing.setUnitPrice(inventoryItem.getUnitPrice());
        if (inventoryItem.getCurrentStock() != null) existing.setCurrentStock(inventoryItem.getCurrentStock());
        if (inventoryItem.getMinStockLevel() != null) existing.setMinStockLevel(inventoryItem.getMinStockLevel());
        if (inventoryItem.getExpiryDate() != null) existing.setExpiryDate(inventoryItem.getExpiryDate());
        if (inventoryItem.getBatchNumber() != null) existing.setBatchNumber(inventoryItem.getBatchNumber());
        if (inventoryItem.getImageUrl() != null) existing.setImageUrl(inventoryItem.getImageUrl());

        PharmacyInventory updated = pharmacyInventoryRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<Void> deleteInventoryItem(
            @PathVariable Long id,
            Authentication authentication) {
        
        String email = authentication.getName();
        User pharmacy = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));

        PharmacyInventory existing = pharmacyInventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        // Verify ownership
        if (!existing.getPharmacy().getId().equals(pharmacy.getId())) {
            return ResponseEntity.status(403).build();
        }

        // Soft delete
        existing.setActive(false);
        pharmacyInventoryRepository.save(existing);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/sync-orders")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<Map<String, Object>> syncOrdersToInventory(Authentication authentication) {
        String email = authentication.getName();
        User pharmacy = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));

        // Find all delivered orders for this pharmacy
        List<Order> deliveredOrders = orderRepository.findByUserAndStatus(pharmacy, Order.OrderStatus.DELIVERED);
        
        int processedOrders = 0;
        int itemsAdded = 0;

        for (Order order : deliveredOrders) {
            try {
                int itemsBefore = pharmacyInventoryRepository.findByPharmacyAndActiveTrue(pharmacy).size();
                pharmacyInventoryService.addOrderItemsToInventory(order);
                int itemsAfter = pharmacyInventoryRepository.findByPharmacyAndActiveTrue(pharmacy).size();
                
                itemsAdded += (itemsAfter - itemsBefore);
                processedOrders++;
            } catch (Exception e) {
                System.err.println("Failed to sync order " + order.getId() + ": " + e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("ordersProcessed", processedOrders);
        result.put("itemsAdded", itemsAdded);
        result.put("message", "Successfully synced " + processedOrders + " orders with " + itemsAdded + " items");

        return ResponseEntity.ok(result);
    }
}


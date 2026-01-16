package com.meditrack.service;

import com.meditrack.entity.*;
import com.meditrack.repository.PharmacyInventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PharmacyInventoryService {

    private final PharmacyInventoryRepository pharmacyInventoryRepository;

    @Transactional
    public void addOrderItemsToInventory(Order order) {
        // Only process for PHARMACY users and DELIVERED orders
        if (order.getUser().getRole() != User.Role.PHARMACY) {
            return;
        }

        if (order.getStatus() != Order.OrderStatus.DELIVERED) {
            return;
        }

        log.info("Adding order items to pharmacy inventory for order: {}", order.getId());

        for (OrderItem orderItem : order.getOrderItems()) {
            Medicine medicine = orderItem.getMedicine();

            // Check if this exact item already exists in inventory
            Optional<PharmacyInventory> existingItem = findExistingInventoryItem(
                    order.getUser(),
                    medicine.getName(),
                    medicine.getBatchNumber());

            if (existingItem.isPresent()) {
                // Update existing inventory
                PharmacyInventory inventory = existingItem.get();
                inventory.setCurrentStock(inventory.getCurrentStock() + orderItem.getQuantity());
                pharmacyInventoryRepository.save(inventory);
                log.info("Updated existing inventory item: {} - Added {} units", inventory.getName(),
                        orderItem.getQuantity());
            } else {
                // Create new inventory item
                PharmacyInventory newItem = new PharmacyInventory();
                newItem.setPharmacy(order.getUser());
                newItem.setName(medicine.getName());
                newItem.setCategory(medicine.getCategory());
                newItem.setGenericName(medicine.getGenericName());
                newItem.setManufacturer(medicine.getManufacturer());
                newItem.setDescription(medicine.getDescription());
                newItem.setUnitPrice(medicine.getUnitPrice());
                newItem.setCurrentStock(orderItem.getQuantity());
                newItem.setMinStockLevel(10);
                newItem.setExpiryDate(medicine.getExpiryDate());
                newItem.setBatchNumber(medicine.getBatchNumber());
                newItem.setImageUrl(medicine.getImageUrl());
                newItem.setSource(PharmacyInventory.InventorySource.PURCHASED);
                newItem.setOrderId(order.getId());
                newItem.setOrderItemId(orderItem.getId());
                newItem.setActive(true);

                pharmacyInventoryRepository.save(newItem);
                log.info("Created new inventory item: {} - {} units", newItem.getName(), newItem.getCurrentStock());
            }
        }
    }

    private Optional<PharmacyInventory> findExistingInventoryItem(User pharmacy, String medicineName,
            String batchNumber) {
        return pharmacyInventoryRepository.findByPharmacyAndActiveTrue(pharmacy).stream()
                .filter(item -> item.getName().equals(medicineName) &&
                        item.getSource() == PharmacyInventory.InventorySource.PURCHASED &&
                        ((batchNumber != null && batchNumber.equals(item.getBatchNumber())) ||
                                (batchNumber == null && item.getBatchNumber() == null)))
                .findFirst();
    }
}

package com.meditrack.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pharmacy_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pharmacy_id", nullable = false)
    private User pharmacy;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 255)
    private String category;

    @Column
    private String genericName;

    @Column
    private String manufacturer;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer currentStock = 0;

    @Column
    private Integer minStockLevel = 10;

    @Column
    private LocalDate expiryDate;

    @Column
    private String batchNumber;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String imageUrl;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InventorySource source = InventorySource.MANUAL;

    @Column
    private Long orderId; // If source is PURCHASED, reference to order

    @Column
    private Long orderItemId; // Reference to specific order item

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum InventorySource {
        MANUAL,     // Manually added by pharmacy
        PURCHASED   // From completed orders
    }
}


package com.meditrack.dto;

import com.meditrack.entity.Medicine;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MedicineDto {
    private Long id;
    private String name;
    private String category;
    private String genericName;
    private String manufacturer;
    private String description;
    private BigDecimal unitPrice;
    private Integer currentStock;
    private Integer minStockLevel;
    private LocalDate expiryDate;
    private String batchNumber;
    private String imageUrl;
    private Long supplierId;
    private String supplierName;
    private Medicine.Status status;

    public static MedicineDto fromEntity(Medicine medicine) {
        MedicineDto dto = new MedicineDto();
        dto.setId(medicine.getId());
        dto.setName(medicine.getName());
        dto.setCategory(medicine.getCategory());
        dto.setGenericName(medicine.getGenericName());
        dto.setManufacturer(medicine.getManufacturer());
        dto.setDescription(medicine.getDescription());
        dto.setUnitPrice(medicine.getUnitPrice());
        dto.setCurrentStock(medicine.getCurrentStock());
        dto.setMinStockLevel(medicine.getMinStockLevel());
        dto.setExpiryDate(medicine.getExpiryDate());
        dto.setBatchNumber(medicine.getBatchNumber());
        dto.setImageUrl(medicine.getImageUrl());
        dto.setSupplierId(medicine.getSupplier().getId());
        dto.setSupplierName(medicine.getSupplier().getOrganizationName());
        dto.setStatus(medicine.getStatus());
        return dto;
    }
}


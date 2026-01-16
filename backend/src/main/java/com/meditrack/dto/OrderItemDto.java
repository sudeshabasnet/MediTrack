package com.meditrack.dto;

import com.meditrack.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private Long id;
    private Long medicineId;
    private String medicineName;
    private String genericName;
    private String manufacturer;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private String medicineImage;

    public static OrderItemDto fromEntity(OrderItem orderItem) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(orderItem.getId());
        dto.setMedicineId(orderItem.getMedicine().getId());
        dto.setMedicineName(orderItem.getMedicine().getName());
        dto.setGenericName(orderItem.getMedicine().getGenericName());
        dto.setManufacturer(orderItem.getMedicine().getManufacturer());
        dto.setQuantity(orderItem.getQuantity());
        dto.setUnitPrice(orderItem.getUnitPrice());
        dto.setSubtotal(orderItem.getSubtotal());
        dto.setMedicineImage(orderItem.getMedicine().getImageUrl());
        return dto;
    }
}




package com.meditrack.dto;

import com.meditrack.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    private Long id;
    private Long medicineId;
    private String medicineName;
    private String medicineCategory;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
    private String medicineImage;

    public static CartItemDto fromEntity(CartItem cartItem) {
        CartItemDto dto = new CartItemDto();
        dto.setId(cartItem.getId());
        dto.setMedicineId(cartItem.getMedicine().getId());
        dto.setMedicineName(cartItem.getMedicine().getName());
        dto.setMedicineCategory(cartItem.getMedicine().getCategory());
        dto.setUnitPrice(cartItem.getMedicine().getUnitPrice());
        dto.setQuantity(cartItem.getQuantity());
        dto.setSubtotal(cartItem.getMedicine().getUnitPrice()
                .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        dto.setMedicineImage(cartItem.getMedicine().getImageUrl());
        return dto;
    }
}

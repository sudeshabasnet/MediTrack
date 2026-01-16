package com.meditrack.dto;

import com.meditrack.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private String fullName;
    private String email;
    private String address;
    private String phoneNumber;
    private BigDecimal totalAmount;
    private BigDecimal deliveryCharge;
    private BigDecimal subtotal;
    private String status;
    private String paymentMethod;
    private String transactionId;
    private String cancellationReason;
    private LocalDateTime cancelledAt;
    private List<OrderItemDto> orderItems;
    private LocalDateTime createdAt;
    private UserDto user;

    public static OrderDto fromEntity(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setFullName(order.getFullName());
        // Use email from order if available, otherwise get from user
        if (order.getEmail() != null && !order.getEmail().isEmpty()) {
            dto.setEmail(order.getEmail());
        } else if (order.getUser() != null) {
            dto.setEmail(order.getUser().getEmail());
        }
        dto.setAddress(order.getAddress());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDeliveryCharge(order.getDeliveryCharge());
        dto.setSubtotal(order.getSubtotal());
        dto.setStatus(order.getStatus().name());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTransactionId(order.getTransactionId());
        dto.setCancellationReason(order.getCancellationReason());
        dto.setCancelledAt(order.getCancelledAt());
        dto.setCreatedAt(order.getCreatedAt());
        if (order.getUser() != null) {
            dto.setUser(UserDto.fromEntity(order.getUser()));
        }
        if (order.getOrderItems() != null) {
            dto.setOrderItems(order.getOrderItems().stream()
                    .map(OrderItemDto::fromEntity)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}




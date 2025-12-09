package com.cook_iq.auth.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private String customerName;
    private String phone;
    private String address;
    private String paymentMethod;
    private List<CartItemDto> items;

    @Data
    public static class CartItemDto {
        private String productId;
        private Integer quantity;
    }
}
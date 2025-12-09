package com.cook_iq.auth.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;
    private String userId;

    // Thông tin giao hàng
    private String customerName;
    private String phone;
    private String address;

    // Thông tin thanh toán
    private Double totalAmount;
    private String paymentMethod; // COD, BANK, QR

    // Trạng thái
    private OrderStatus status;

    // Danh sách sản phẩm
    private List<OrderItem> items;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItem {
        private String productId;
        private String productName;
        private Double price; // Giá tại thời điểm mua
        private Integer quantity;
        private String image;
    }
}
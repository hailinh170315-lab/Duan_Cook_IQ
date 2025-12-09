package com.cook_iq.auth.model;

public enum OrderStatus {
    PENDING,    // Chờ duyệt
    CONFIRMED,  // Đã duyệt (Đang chờ vận chuyển)
    SHIPPING,   // Đang giao hàng
    DELIVERED,  // Đã giao hàng thành công
    CANCELLED   // Đã hủy
}

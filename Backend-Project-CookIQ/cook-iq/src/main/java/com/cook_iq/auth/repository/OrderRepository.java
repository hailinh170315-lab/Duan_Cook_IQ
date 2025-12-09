package com.cook_iq.auth.repository;

import com.cook_iq.auth.model.Order;
import com.cook_iq.auth.model.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Order> findAllByOrderByCreatedAtDesc();

    // Tìm các đơn đang giao để job tự động quét
    List<Order> findByStatus(OrderStatus status);
}
package com.cook_iq.auth.controller;

import com.cook_iq.auth.dto.CreateOrderRequest;
import com.cook_iq.auth.model.Order;
import com.cook_iq.auth.model.OrderStatus;
import com.cook_iq.auth.model.User;
import com.cook_iq.auth.service.AuthService;
import com.cook_iq.auth.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    // User tạo đơn
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = authService.getUserRepository().findByEmail(email).orElseThrow();
        return ResponseEntity.ok(orderService.createOrder(user.getId(), req));
    }

    // User xem đơn của mình
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = authService.getUserRepository().findByEmail(email).orElseThrow();
        return ResponseEntity.ok(orderService.getUserOrders(user.getId()));
    }

    // Admin xem tất cả
    @GetMapping("/admin/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Admin cập nhật trạng thái
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}
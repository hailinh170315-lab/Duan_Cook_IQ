package com.cook_iq.auth.service;

import com.cook_iq.auth.dto.CreateOrderRequest;
import com.cook_iq.auth.model.*;
import com.cook_iq.auth.repository.OrderRepository;
import com.cook_iq.auth.repository.ProductRepository;
import com.cook_iq.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    @Transactional
    public Order createOrder(String userId, CreateOrderRequest req) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        double totalAmount = 0;
        List<Order.OrderItem> orderItems = new ArrayList<>();

        // 1. Duyệt qua từng sản phẩm để tính tiền và check kho
        for (CreateOrderRequest.CartItemDto itemDto : req.getItems()) {
            Product product = productRepo.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: " + itemDto.getProductId()));

            if (product.getStockQuantity() < itemDto.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng tồn kho.");
            }

            // Trừ kho
            product.setStockQuantity(product.getStockQuantity() - itemDto.getQuantity());
            productRepo.save(product);

            // Tạo OrderItem snapshot
            Order.OrderItem orderItem = Order.OrderItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .price(product.getPrice())
                    .quantity(itemDto.getQuantity())
                    .image(product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : "")
                    .build();

            orderItems.add(orderItem);
            totalAmount += (product.getPrice() * itemDto.getQuantity());
        }

        // 2. Tạo Order
        Order order = Order.builder()
                .userId(userId)
                .customerName(req.getCustomerName())
                .phone(req.getPhone())
                .address(req.getAddress())
                .paymentMethod(req.getPaymentMethod())
                .status(OrderStatus.PENDING) // Mặc định là Chờ duyệt
                .items(orderItems)
                .totalAmount(totalAmount)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return orderRepo.save(order);
    }

    // Lấy đơn của User
    public List<Order> getUserOrders(String userId) {
        return orderRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Lấy tất cả đơn (Admin)
    public List<Order> getAllOrders() {
        return orderRepo.findAllByOrderByCreatedAtDesc();
    }

    // Admin cập nhật trạng thái (Duyệt, Hủy...)
    public Order updateStatus(String orderId, OrderStatus newStatus) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        // Nếu hủy đơn -> Hoàn lại kho (Logic nâng cao, ở đây tạm bỏ qua cho đơn giản)

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepo.save(order);
    }

    // --- JOB TỰ ĐỘNG ---
    // Giả lập đơn vị vận chuyển: Quét các đơn đang SHIPPING, tự động chuyển thành DELIVERED sau 2 phút
    // Cần thêm @EnableScheduling ở file main Application
    @Scheduled(fixedRate = 60000) // Chạy mỗi 60 giây
    public void autoUpdateShippingStatus() {
        List<Order> shippingOrders = orderRepo.findByStatus(OrderStatus.SHIPPING);

        for (Order order : shippingOrders) {
            // Logic giả lập: Nếu đơn đã ở trạng thái Shipping hơn 2 phút thì coi như đã giao
            if (order.getUpdatedAt().isBefore(LocalDateTime.now().minusMinutes(2))) {
                order.setStatus(OrderStatus.DELIVERED);
                order.setUpdatedAt(LocalDateTime.now());
                orderRepo.save(order);
                System.out.println("Auto updated order " + order.getId() + " to DELIVERED");
            }
        }
    }
}
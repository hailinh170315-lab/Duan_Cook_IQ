package com.cook_iq.auth.service;

import com.cook_iq.auth.dto.CreateProductRequest;
import com.cook_iq.auth.dto.UpdateProductRequest;
import com.cook_iq.auth.model.Product;
import com.cook_iq.auth.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepo;

    // Tạo sản phẩm mới
    public Product createProduct(CreateProductRequest req) {
        Product p = Product.builder()
                .name(req.getName())
                .slug(req.getSlug())
                .shortDescription(req.getShortDescription())
                .description(req.getDescription())
                .price(req.getPrice())
                .currency(req.getCurrency())
                .categoryId(req.getCategoryId())
                .images(req.getImages())
                .stockQuantity(req.getStockQuantity())
                .unit(req.getUnit())
                .tags(req.getTags())
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        return productRepo.save(p);
    }

    // Cập nhật sản phẩm
    public Product updateProduct(String id, UpdateProductRequest req) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        p.setName(req.getName());
        p.setSlug(req.getSlug());
        p.setShortDescription(req.getShortDescription());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setCurrency(req.getCurrency());
        p.setCategoryId(req.getCategoryId());
        p.setImages(req.getImages());
        p.setStockQuantity(req.getStockQuantity());
        p.setUnit(req.getUnit());
        p.setTags(req.getTags());
        p.setUpdatedAt(Instant.now());

        return productRepo.save(p);
    }

    // Xóa sản phẩm
    public void deleteProduct(String id) {
        productRepo.deleteById(id);
    }

    // Cập nhật số lượng kho
    public Product updateStock(String id, int delta) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int newStock = p.getStockQuantity() + delta;
        if (newStock < 0) newStock = 0;
        p.setStockQuantity(newStock);
        p.setUpdatedAt(Instant.now());

        return productRepo.save(p);
    }

    // Lấy tất cả sản phẩm (active)
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepo.findByIsActiveTrue(pageable);
    }

    // Lấy sản phẩm theo id
    public Product getProductById(String id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // Lấy sản phẩm theo slug
    public Product getProductBySlug(String slug) {
        return productRepo.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // Lấy sản phẩm theo danh mục
    public Page<Product> getProductsByCategory(String categoryId, Pageable pageable) {
        return productRepo.findByCategoryId(categoryId, pageable);
    }
}

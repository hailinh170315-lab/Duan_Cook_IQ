package com.cook_iq.auth.controller;

import com.cook_iq.auth.dto.CreateProductRequest;
import com.cook_iq.auth.dto.UpdateProductRequest;
import com.cook_iq.auth.model.Product;
import com.cook_iq.auth.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    // Public endpoints
    @GetMapping
    public Page<Product> listAll(Pageable pageable) {
        return productService.getAllProducts(pageable);
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable String id) {
        return productService.getProductById(id);
    }

    @GetMapping("/slug/{slug}")
    public Product getBySlug(@PathVariable String slug) {
        return productService.getProductBySlug(slug);
    }

    @GetMapping("/category/{categoryId}")
    public Page<Product> getByCategory(@PathVariable String categoryId, Pageable pageable) {
        return productService.getProductsByCategory(categoryId, pageable);
    }

    // Admin endpoints
    @PostMapping("/admin")
    public Product create(@RequestBody CreateProductRequest req) {
        return productService.createProduct(req);
    }

    @PutMapping("/admin/{id}")
    public Product update(@PathVariable String id, @RequestBody UpdateProductRequest req) {
        return productService.updateProduct(id, req);
    }

    @PatchMapping("/admin/{id}/stock")
    public Product updateStock(@PathVariable String id, @RequestParam int delta) {
        return productService.updateStock(id, delta);
    }

    @DeleteMapping("/admin/{id}")
    public void delete(@PathVariable String id) {
        productService.deleteProduct(id);
    }
}

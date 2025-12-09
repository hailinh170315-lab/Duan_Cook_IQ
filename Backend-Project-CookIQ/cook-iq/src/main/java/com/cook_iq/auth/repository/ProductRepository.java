package com.cook_iq.auth.repository;

import com.cook_iq.auth.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;


public interface ProductRepository extends MongoRepository<Product, String> {
    Optional<Product> findBySlug(String slug);
    Page<Product> findByCategoryId(String categoryId, Pageable pageable);
    Page<Product> findByIsActiveTrue(Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

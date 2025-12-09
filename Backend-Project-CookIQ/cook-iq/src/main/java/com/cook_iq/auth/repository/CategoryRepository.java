package com.cook_iq.auth.repository;

import com.cook_iq.auth.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;


public interface CategoryRepository extends MongoRepository<Category, String> {
    Optional<Category> findBySlug(String slug);
}

package com.cook_iq.auth.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String slug;
    private String shortDescription;
    private String description;
    private Double price;
    private String currency;
    private String categoryId;
    private List<String> images;
    private Integer stockQuantity;
    private String unit;
    private List<String> tags;
    private Boolean isActive = true;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
}

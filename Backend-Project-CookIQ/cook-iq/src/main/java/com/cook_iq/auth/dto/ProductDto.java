package com.cook_iq.auth.dto;

import lombok.*;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
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
    private Boolean isActive;
}

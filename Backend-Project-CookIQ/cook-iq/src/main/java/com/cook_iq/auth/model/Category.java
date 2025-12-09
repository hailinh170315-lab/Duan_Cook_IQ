package com.cook_iq.auth.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "categories")
public class Category {
    @Id
    private String id;
    private String name;
    private String slug;
    private String parentId;
    private Instant createdAt = Instant.now();
}

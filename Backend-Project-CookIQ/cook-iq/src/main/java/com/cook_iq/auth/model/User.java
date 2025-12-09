package com.cook_iq.auth.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String fullName;
    private String email;
    private String password;

    private Roles roles;

    private String avatarUrl;

    @CreatedDate
    private LocalDateTime createdAt;
}

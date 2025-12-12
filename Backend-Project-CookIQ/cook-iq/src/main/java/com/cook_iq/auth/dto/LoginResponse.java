package com.cook_iq.auth.dto;

import com.cook_iq.auth.model.Roles;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String id;
    private String email;
    private String fullName;
    private Roles roles;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private String token;
}

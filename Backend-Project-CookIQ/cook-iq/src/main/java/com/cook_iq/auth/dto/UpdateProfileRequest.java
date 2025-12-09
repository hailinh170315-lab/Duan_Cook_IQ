package com.cook_iq.auth.dto;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String avatarUrl;
}
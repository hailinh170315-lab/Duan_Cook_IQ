package com.cook_iq.auth.dto;

import lombok.Data;

@Data
public class AddCommentRequest {
    private String userId; // ID người bình luận
    private String content; // Nội dung
}
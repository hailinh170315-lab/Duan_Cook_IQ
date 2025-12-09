package com.cook_iq.auth.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "blog_posts")
public class BlogPost {

    @Id
    private String id;

    private String title;

    private BlogCategory category;

    private String coverImageUrl; // link ảnh export

    private String content;

    private String authorId;

    private String authorName;

    private Boolean approved;

    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;

    // Khởi tạo list rỗng để tránh lỗi NullPointerException
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Comment {
        private String id;
        private String userId;
        private String userName; // Lưu luôn tên lúc comment
        private String userAvatar;
        private String content;
        private LocalDateTime createdAt;
    }
}

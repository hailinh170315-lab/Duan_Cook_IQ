package com.cook_iq.auth.dto;

import com.cook_iq.auth.model.BlogCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBlogRequest {
    private String title;
    private BlogCategory category;
    private String coverImageUrl;
    private String content;
    private String authorId;
}

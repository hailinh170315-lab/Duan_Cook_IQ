package com.cook_iq.auth.controller;

import com.cook_iq.auth.dto.CreateBlogRequest;
import com.cook_iq.auth.model.BlogPost;
import com.cook_iq.auth.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.cook_iq.auth.dto.AddCommentRequest;

@RestController
@RequestMapping("api/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody CreateBlogRequest req) {
        BlogPost created = blogService.createPost(req);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approvePost(@PathVariable String id) {
        return ResponseEntity.ok(blogService.approvePost(id));
    }

    @DeleteMapping("/reject/{id}")
    public ResponseEntity<?> rejectPost(@PathVariable String id) {
        blogService.rejectPost(id);
        return ResponseEntity.ok("Đã từ chối và xóa bài");
    }

    @DeleteMapping("/delete-approved/{id}")
    public ResponseEntity<?> deleteApprovedPost(@PathVariable String id) {
        blogService.deleteApprovedPost(id);
        return ResponseEntity.ok("Đã xóa bài đã duyệt");
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPending() {
        return ResponseEntity.ok(blogService.getPendingPosts());
    }

    @GetMapping("/approved")
    public ResponseEntity<?> getApproved() {
        return ResponseEntity.ok(blogService.getApprovedPosts());
    }

    // Public: danh sách bài đã duyệt
    @GetMapping("/public")
    public ResponseEntity<List<BlogPost>> getPublicPosts() {
        List<BlogPost> posts = blogService.getApprovedPosts();
        return ResponseEntity.ok(posts);
    }

    // Public: chi tiết 1 bài
    @GetMapping("/public/{id}")
    public ResponseEntity<BlogPost> getPublicPost(@PathVariable String id) {
        BlogPost post = blogService.getApprovedPostById(id);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/comment/{blogId}")
    public ResponseEntity<?> addComment(@PathVariable String blogId, @RequestBody AddCommentRequest req) {
        return ResponseEntity.ok(blogService.addComment(blogId, req));
    }
}


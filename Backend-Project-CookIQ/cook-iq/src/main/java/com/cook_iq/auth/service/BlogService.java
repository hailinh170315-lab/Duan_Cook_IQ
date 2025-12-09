package com.cook_iq.auth.service;

import com.cook_iq.auth.dto.CreateBlogRequest;
import com.cook_iq.auth.model.BlogPost;
import com.cook_iq.auth.model.User;
import com.cook_iq.auth.repository.BlogPostRepository;
import com.cook_iq.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import com.cook_iq.auth.dto.AddCommentRequest;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogPostRepository blogRepo;
    private final UserRepository userRepo;

    // User tạo bài
    public BlogPost createPost(CreateBlogRequest req) {

        // <--- 2. Tìm thông tin người dùng để lấy tên
        User author = userRepo.findById(req.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        BlogPost post = BlogPost.builder()
                .title(req.getTitle())
                .category(req.getCategory())
                .content(req.getContent())
                .coverImageUrl(req.getCoverImageUrl())
                .authorId(req.getAuthorId())
                .authorName(author.getFullName())
                .approved(false)
                .createdAt(LocalDateTime.now())
                .build();

        return blogRepo.save(post);
    }

    // Admin duyệt bài
    public BlogPost approvePost(String blogId) {
        BlogPost post = blogRepo.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        post.setApproved(true);
        post.setApprovedAt(LocalDateTime.now());

        return blogRepo.save(post);
    }

    // Admin từ chối → XÓA khỏi DB
    public void rejectPost(String blogId) {
        blogRepo.deleteById(blogId);
    }

    // Admin xóa bài đã duyệt
    public void deleteApprovedPost(String blogId) {
        blogRepo.deleteById(blogId);
    }

    // Lấy danh sách bài chưa duyệt
    public List<BlogPost> getPendingPosts() {
        return blogRepo.findByApproved(false);
    }

    // Lấy danh sách bài đã duyệt
    public List<BlogPost> getApprovedPosts() {
        return blogRepo.findByApprovedTrueOrderByCreatedAtDesc();
    }

    public BlogPost getApprovedPostById(String id) {
        return blogRepo.findByIdAndApprovedTrue(id)
                .orElseThrow(() -> new RuntimeException("Post not found or not approved"));
    }

    // Thêm comment vào bài viết
    public BlogPost addComment(String blogId, AddCommentRequest req) {
        // Tìm bài viết
        BlogPost post = blogRepo.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Bài viết không tồn tại"));

        // Tìm thông tin người bình luận để lấy tên hiển thị
        User commenter = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Tạo comment mới
        BlogPost.Comment newComment = BlogPost.Comment.builder()
                .id(UUID.randomUUID().toString())
                .userId(commenter.getId())
                .userName(commenter.getFullName())
                .userAvatar(commenter.getAvatarUrl())
                .content(req.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        // Thêm vào list và lưu
        if (post.getComments() == null) {
            post.setComments(new java.util.ArrayList<>());
        }
        post.getComments().add(newComment);

        return blogRepo.save(post);
    }
}


package com.cook_iq.auth.repository;

import com.cook_iq.auth.model.BlogPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends MongoRepository<BlogPost, String> {

    List<BlogPost> findByApproved(Boolean approved);

    List<BlogPost> findByAuthorId(String authorId);

    List<BlogPost> findByApprovedTrueOrderByCreatedAtDesc();

    Optional<BlogPost> findByIdAndApprovedTrue(String id);

}


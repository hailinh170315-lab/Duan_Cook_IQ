package com.cook_iq.auth.service;

import com.cook_iq.auth.dto.*;
import com.cook_iq.auth.model.Roles;
import com.cook_iq.auth.model.User;
import com.cook_iq.auth.repository.UserRepository;
import com.cook_iq.auth.security.UserDetailsServiceImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder, UserDetailsServiceImpl userDetailsService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
    }

    // Getter để AuthController dùng
    public UserRepository getUserRepository() {
        return userRepository;
    }

    // Đăng ký user
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Roles.USER)
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(user);
    }

    // Đăng nhập, trả về JWT token
    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }
        // Tạo UserDetails từ User
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        // Tạo token từ UserDetails
        String token = jwtService.generateToken(userDetails);

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRoles(),
                user.getCreatedAt(),
                token
        );
    }

    // Lấy thông tin user theo userId
    public User getCurrentUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
    }

    // Cập nhật Profile
    public User updateProfile(String userId, UpdateProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        if (req.getFullName() != null && !req.getFullName().isEmpty()) {
            user.setFullName(req.getFullName());
        }
        if (req.getAvatarUrl() != null && !req.getAvatarUrl().isEmpty()) {
            user.setAvatarUrl(req.getAvatarUrl());
        }

        return userRepository.save(user);
    }
}

package com.cook_iq.auth.config;

import com.cook_iq.auth.model.Roles;
import com.cook_iq.auth.model.User;
import com.cook_iq.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class EncodeAdminPasswordRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public EncodeAdminPasswordRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@example.com"; // email admin bạn đã tạo
        String rawPassword = "abcd@1234";        // password hiện tại của admin

        Optional<User> adminOpt = userRepository.findByEmail(adminEmail);

        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            // Nếu password chưa encode (không bắt đầu bằng $2a$), encode lại
            if (!admin.getPassword().startsWith("$2a$")) {
                admin.setPassword(passwordEncoder.encode(rawPassword));
                userRepository.save(admin);
                System.out.println("Admin password updated to BCrypt!");
            } else {
                System.out.println("Admin already exists with encoded password.");
            }
        } else {
            // Admin chưa tồn tại → tạo mới
            User admin = User.builder()
                    .fullName("Administrator")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(rawPassword))
                    .roles(Roles.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin created with email: " + adminEmail + " and password: " + rawPassword);
        }
    }
}


package com.cook_iq.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String projectPath = System.getProperty("user.dir");

        // Cấu hình mapping
        // Nếu user truy cập: http://localhost:8080/uploads/anh.jpg
        // Hệ thống sẽ tìm trong: C:/.../TenProject/uploads/anh.jpg
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/var/www/cookiq/uploads/");
    }
}
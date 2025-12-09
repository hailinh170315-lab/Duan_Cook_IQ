package com.cook_iq.auth.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path storageLocation = Paths.get("uploads");

    public FileStorageService() {
        try {
            Files.createDirectories(storageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Không thể tạo thư mục upload", e);
        }
    }

    public String storeFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File rỗng");
            }
            // Tạo tên file ngẫu nhiên để tránh trùng lặp
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + fileExtension;

            Path destinationFile = this.storageLocation.resolve(newFilename)
                    .normalize().toAbsolutePath();

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            // Trả về đường dẫn URL tương đối (ví dụ: /uploads/abc.jpg)
            return "/uploads/" + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Thất bại khi lưu file", e);
        }
    }
}
package com.cook_iq.auth.controller;

import com.cook_iq.auth.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        // Trả về full URL (ví dụ: http://localhost:8080/uploads/abc.jpg)
        String fileUrl = "http://localhost:8080" + fileName;

        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
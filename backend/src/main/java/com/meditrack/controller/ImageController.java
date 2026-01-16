package com.meditrack.controller;

import com.meditrack.entity.User;
import com.meditrack.repository.UserRepository;
import com.meditrack.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ImageController {
    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        try {
            if (file.isEmpty()) {
                response.put("error", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("error", "File must be an image");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file size (10MB max)
            if (file.getSize() > 10 * 1024 * 1024) {
                response.put("error", "File size must be less than 10MB");
                return ResponseEntity.badRequest().body(response);
            }

            String imageUrl = cloudinaryService.uploadImage(file);
            response.put("imageUrl", imageUrl);
            response.put("message", "Image uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/upload-document")
    public ResponseEntity<Map<String, String>> uploadDocument(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        try {
            if (file.isEmpty()) {
                response.put("error", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file type (PDF or image)
            String contentType = file.getContentType();
            if (contentType == null || 
                (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
                response.put("error", "File must be an image or PDF");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file size (10MB max)
            if (file.getSize() > 10 * 1024 * 1024) {
                response.put("error", "File size must be less than 10MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Upload to Cloudinary (in documents folder)
            String documentUrl = cloudinaryService.uploadDocument(file);
            
            response.put("documentUrl", documentUrl);
            response.put("imageUrl", documentUrl); // Also return as imageUrl for compatibility
            response.put("message", "Document uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("error", "Failed to upload document: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/upload-legal-document")
    @PreAuthorize("hasAnyRole('PHARMACY', 'SUPPLIER')")
    public ResponseEntity<Map<String, String>> uploadLegalDocument(
            @RequestParam("file") MultipartFile file,
            Principal principal) {
        Map<String, String> response = new HashMap<>();
        
        try {
            if (file.isEmpty()) {
                response.put("error", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file type (PDF or image)
            String contentType = file.getContentType();
            if (contentType == null || 
                (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
                response.put("error", "File must be an image or PDF");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file size (10MB max)
            if (file.getSize() > 10 * 1024 * 1024) {
                response.put("error", "File size must be less than 10MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Upload to Cloudinary (in documents folder)
            String documentUrl = cloudinaryService.uploadDocument(file);
            
            // Update user's legal document URL
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setLegalDocumentUrl(documentUrl);
            user.setVerificationStatus(User.VerificationStatus.PENDING);
            userRepository.save(user);
            
            response.put("documentUrl", documentUrl);
            response.put("message", "Legal document uploaded successfully. Waiting for admin verification.");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("error", "Failed to upload document: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}



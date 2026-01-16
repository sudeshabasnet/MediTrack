package com.meditrack.controller;

import com.meditrack.dto.ReviewDto;
import com.meditrack.entity.Medicine;
import com.meditrack.entity.Review;
import com.meditrack.entity.User;
import com.meditrack.repository.MedicineRepository;
import com.meditrack.repository.ReviewRepository;
import com.meditrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;

    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<List<ReviewDto>> getMedicineReviews(@PathVariable Long medicineId) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        
        List<Review> reviews = reviewRepository.findByMedicine(medicine);
        List<ReviewDto> reviewDtos = reviews.stream()
                .map(ReviewDto::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(reviewDtos);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY')")
    public ResponseEntity<ReviewDto> createReview(
            @RequestBody Map<String, Object> request,
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long medicineId = Long.valueOf(request.get("medicineId").toString());
        Integer rating = Integer.valueOf(request.get("rating").toString());
        String comment = (String) request.getOrDefault("comment", "");
        
        if (rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().build();
        }
        
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        
        Optional<Review> existingReview = reviewRepository.findByUserAndMedicine(user, medicine);
        Review review;
        
        if (existingReview.isPresent()) {
            review = existingReview.get();
            review.setRating(rating);
            review.setComment(comment);
        } else {
            review = new Review();
            review.setUser(user);
            review.setMedicine(medicine);
            review.setRating(rating);
            review.setComment(comment);
        }
        
        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(ReviewDto.fromEntity(saved));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'PHARMACY', 'ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!user.getRole().equals(User.Role.ADMIN) && 
            !review.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        reviewRepository.delete(review);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/medicine/{medicineId}/average")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long medicineId) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        
        List<Review> reviews = reviewRepository.findByMedicine(medicine);
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        
        return ResponseEntity.ok(Map.of(
                "averageRating", average,
                "totalReviews", reviews.size()
        ));
    }
}




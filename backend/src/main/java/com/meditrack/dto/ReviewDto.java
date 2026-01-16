package com.meditrack.dto;

import com.meditrack.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long medicineId;
    private String medicineName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public static ReviewDto fromEntity(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setUserId(review.getUser().getId());
        dto.setUserName(review.getUser().getFullName());
        dto.setMedicineId(review.getMedicine().getId());
        dto.setMedicineName(review.getMedicine().getName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}




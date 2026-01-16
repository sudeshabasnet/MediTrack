package com.meditrack.repository;

import com.meditrack.entity.Medicine;
import com.meditrack.entity.Review;
import com.meditrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMedicine(Medicine medicine);
    List<Review> findByUser(User user);
    Optional<Review> findByUserAndMedicine(User user, Medicine medicine);
}


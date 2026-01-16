package com.meditrack.repository;

import com.meditrack.entity.PasswordResetToken;
import com.meditrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    
    List<PasswordResetToken> findByUser(User user);
    
    List<PasswordResetToken> findByExpiryDateBeforeAndUsedFalse(LocalDateTime now);
    
    void deleteByUser(User user);
}







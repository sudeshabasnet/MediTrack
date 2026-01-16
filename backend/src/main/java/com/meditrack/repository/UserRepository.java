package com.meditrack.repository;

import com.meditrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByLicenseNumber(String licenseNumber);
    long countByRole(User.Role role);
    List<User> findByVerificationStatus(User.VerificationStatus status);
    org.springframework.data.domain.Page<User> findByRole(User.Role role, org.springframework.data.domain.Pageable pageable);
}


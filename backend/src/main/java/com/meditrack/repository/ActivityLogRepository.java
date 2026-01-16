package com.meditrack.repository;

import com.meditrack.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    Page<ActivityLog> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Page<ActivityLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId, Pageable pageable);
    List<ActivityLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    Page<ActivityLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}




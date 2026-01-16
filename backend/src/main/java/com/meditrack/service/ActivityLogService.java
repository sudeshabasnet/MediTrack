package com.meditrack.service;

import com.meditrack.entity.ActivityLog;
import com.meditrack.entity.User;
import com.meditrack.repository.ActivityLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;

    @Transactional
    public void logActivity(User user, String action, String entityType, Long entityId, 
                           String description, HttpServletRequest request) {
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDescription(description);
        log.setIpAddress(getClientIpAddress(request));
        activityLogRepository.save(log);
    }

    public Page<ActivityLog> getUserActivities(Long userId, Pageable pageable) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public Page<ActivityLog> getEntityActivities(String entityType, Long entityId, Pageable pageable) {
        return activityLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId, pageable);
    }

    public Page<ActivityLog> getAllActivities(Pageable pageable) {
        return activityLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public List<ActivityLog> getActivitiesByDateRange(LocalDateTime start, LocalDateTime end) {
        return activityLogRepository.findByCreatedAtBetween(start, end);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}




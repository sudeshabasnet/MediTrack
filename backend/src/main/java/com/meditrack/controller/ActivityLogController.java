package com.meditrack.controller;

import com.meditrack.entity.ActivityLog;
import com.meditrack.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/activities")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
@PreAuthorize("hasRole('ADMIN')")
public class ActivityLogController {
    private final ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<Page<ActivityLog>> getAllActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ActivityLog> activities = activityLogService.getAllActivities(pageable);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ActivityLog>> getUserActivities(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ActivityLog> activities = activityLogService.getUserActivities(userId, pageable);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<Page<ActivityLog>> getEntityActivities(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ActivityLog> activities = activityLogService.getEntityActivities(entityType, entityId, pageable);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ActivityLog>> getActivitiesByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<ActivityLog> activities = activityLogService.getActivitiesByDateRange(start, end);
        return ResponseEntity.ok(activities);
    }
}




package com.meditrack.config;

import com.meditrack.entity.User;
import com.meditrack.repository.UserRepository;
import com.meditrack.service.ActivityLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.security.Principal;

@Aspect
@Component
@RequiredArgsConstructor
public class ActivityLogAspect {
    private final ActivityLogService activityLogService;
    private final UserRepository userRepository;

    @AfterReturning(pointcut = "@annotation(com.meditrack.annotation.LogActivity)", returning = "result")
    public void logActivity(JoinPoint joinPoint, Object result) {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes == null) return;
            
            HttpServletRequest request = attributes.getRequest();
            Object principalObj = request.getUserPrincipal();
            
            if (principalObj instanceof Principal) {
                Principal principal = (Principal) principalObj;
                User user = userRepository.findByEmail(principal.getName()).orElse(null);
                if (user != null) {
                    String action = joinPoint.getSignature().getName();
                    String entityType = "MEDICINE"; // Default, can be extracted from annotation
                    
                    activityLogService.logActivity(user, action, entityType, null, 
                            "Action performed: " + action, request);
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the request
            System.err.println("Error logging activity: " + e.getMessage());
        }
    }
}


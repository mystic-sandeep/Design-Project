package com.mygate.service;

import com.mygate.entity.AuditLog;
import com.mygate.entity.User;
import com.mygate.repository.AuditLogRepository;
import com.mygate.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AuditLogService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public void logAction(String userId, String action, String resourceType, String resourceId, 
                         Map<String, Object> oldValues, Map<String, Object> newValues, String ipAddress) {
        logAction(userId, action, resourceType, resourceId, oldValues, newValues, ipAddress, "SUCCESS", null);
    }
    
    public void logAction(String userId, String action, String resourceType, String resourceId,
                         Map<String, Object> oldValues, Map<String, Object> newValues, 
                         String ipAddress, String status, String errorMessage) {
        try {
            User user = null;
            if (userId != null) {
                user = userRepository.findById(userId).orElse(null);
            }
            
            AuditLog auditLog = AuditLog.builder()
                    .user(user)
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .oldValues(objectMapper.writeValueAsString(oldValues))
                    .newValues(objectMapper.writeValueAsString(newValues))
                    .ipAddress(ipAddress)
                    .status(status)
                    .errorMessage(errorMessage)
                    .createdAt(LocalDateTime.now())
                    .build();
            
            auditLogRepository.save(auditLog);
            
            log.info("AUDIT LOG: User={}, Action={}, Resource={}, Status={}", 
                    userId, action, resourceType, status);
        } catch (Exception e) {
            log.error("Failed to log audit action", e);
        }
    }
    
    public List<AuditLog> getUserAuditLogs(String userId) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<AuditLog> getActionAuditLogs(String action) {
        return auditLogRepository.findByActionOrderByCreatedAtDesc(action);
    }
    
    public List<AuditLog> getResourceAuditLogs(String resourceType, String resourceId) {
        return auditLogRepository.findByResourceTypeAndResourceId(resourceType, resourceId);
    }
    
    public List<AuditLog> getAuditLogsByDateRange(LocalDateTime start, LocalDateTime end) {
        return auditLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);
    }
    
    public void logLogin(String userId, String ipAddress, String userAgent) {
        logAction(userId, "LOGIN", "SESSION", userId, null, 
                Map.of("ip", ipAddress, "userAgent", userAgent), ipAddress, "SUCCESS", null);
    }
    
    public void logLogout(String userId, String ipAddress) {
        logAction(userId, "LOGOUT", "SESSION", userId, null, 
                Map.of("ip", ipAddress), ipAddress, "SUCCESS", null);
    }
    
    public void logFailedLogin(String email, String ipAddress, String reason) {
        logAction(null, "LOGIN_FAILED", "SESSION", email, null, 
                Map.of("email", email, "reason", reason), ipAddress, "FAILED", reason);
    }
    
    public void logUserCreation(String adminId, String newUserId, String email, String role, String ipAddress) {
        logAction(adminId, "USER_CREATED", "USER", newUserId, null,
                Map.of("email", email, "role", role, "userId", newUserId), ipAddress, "SUCCESS", null);
    }
    
    public void logPermissionCheck(String userId, String permission, boolean granted, String ipAddress) {
        logAction(userId, "PERMISSION_CHECK", "PERMISSION", permission, null,
                Map.of("permission", permission, "granted", granted), ipAddress, 
                granted ? "SUCCESS" : "DENIED", null);
    }
}

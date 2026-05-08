package com.mygate.service;

import com.mygate.entity.*;
import com.mygate.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Admin operations service
 */
@Slf4j
@Service
public class AdminService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private GuardRepository guardRepository;
    
    @Autowired
    private ResidentEnhancedRepository residentRepository;
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    @Autowired
    private AuditLogService auditLogService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Get dashboard statistics
     */
    public Map<String, Object> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalAdmins = adminRepository.count();
        long totalGuards = guardRepository.count();
        long totalResidents = residentRepository.count();
        long totalAuditLogs = auditLogRepository.count();
        
        return Map.of(
                "totalUsers", totalUsers,
                "totalAdmins", totalAdmins,
                "totalGuards", totalGuards,
                "totalResidents", totalResidents,
                "totalAuditLogs", totalAuditLogs,
                "activeUsers", userRepository.findByRoleAndIsActiveTrue(User.Role.RESIDENT).size(),
                "timestamp", System.currentTimeMillis()
        );
    }
    
    /**
     * Get all users with pagination
     */
    public List<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> userList = new ArrayList<>();
        
        for (User user : users) {
            userList.add(Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "phone", user.getPhone(),
                    "role", user.getRole().toString(),
                    "isActive", user.getIsActive(),
                    "lastLogin", user.getLastLogin() != null ? user.getLastLogin().toString() : "Never",
                    "createdAt", user.getCreatedAt().toString()
            ));
        }
        
        return userList;
    }
    
    /**
     * Get users by role
     */
    public List<Map<String, Object>> getUsersByRole(User.Role role) {
        List<User> users = userRepository.findByRoleAndIsActiveTrue(role);
        List<Map<String, Object>> userList = new ArrayList<>();
        
        for (User user : users) {
            userList.add(Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "phone", user.getPhone(),
                    "role", user.getRole().toString(),
                    "createdAt", user.getCreatedAt().toString()
            ));
        }
        
        return userList;
    }
    
    /**
     * Deactivate user
     */
    @Transactional
    public void deactivateUser(String userId, String adminId, String ipAddress) {
        userService.deactivateUser(userId, adminId);
        auditLogService.logAction(adminId, "USER_DEACTIVATED", "USER", userId, null,
                Map.of("userId", userId), ipAddress, "SUCCESS", null);
    }
    
    /**
     * Get audit logs with filters
     */
    public List<Map<String, Object>> getAuditLogs(String action, String userId, int limit) {
        List<AuditLog> logs;
        
        if (action != null) {
            logs = auditLogRepository.findByActionOrderByCreatedAtDesc(action);
        } else if (userId != null) {
            logs = auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            logs = auditLogRepository.findAll();
        }
        
        List<Map<String, Object>> logList = new ArrayList<>();
        int count = 0;
        
        for (AuditLog log : logs) {
            if (count++ >= limit) break;
            
            logList.add(Map.of(
                    "id", log.getId(),
                    "userId", log.getUser() != null ? log.getUser().getId() : "System",
                    "action", log.getAction(),
                    "resourceType", log.getResourceType() != null ? log.getResourceType() : "N/A",
                    "resourceId", log.getResourceId() != null ? log.getResourceId() : "N/A",
                    "status", log.getStatus(),
                    "ipAddress", log.getIpAddress() != null ? log.getIpAddress() : "N/A",
                    "createdAt", log.getCreatedAt().toString()
            ));
        }
        
        return logList;
    }
    
    /**
     * Generate report - User activity
     */
    public Map<String, Object> generateUserActivityReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<AuditLog> logs = auditLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate);
        
        Map<String, Long> userActivity = new HashMap<>();
        for (AuditLog log : logs) {
            if (log.getUser() != null) {
                String userId = log.getUser().getId();
                userActivity.put(userId, userActivity.getOrDefault(userId, 0L) + 1);
            }
        }
        
        return Map.of(
                "reportType", "USER_ACTIVITY",
                "startDate", startDate.toString(),
                "endDate", endDate.toString(),
                "totalActions", logs.size(),
                "userActivity", userActivity,
                "generatedAt", LocalDateTime.now().toString()
        );
    }
    
    /**
     * Get all visitors (from existing system)
     */
    public List<Map<String, Object>> getAllVisitors() {
        // Placeholder - implement based on your Visitor entity
        return new ArrayList<>();
    }
    
    /**
     * Add visitor
     */
    public Map<String, Object> addVisitor(Map<String, String> body) {
        // Placeholder
        return Map.of("success", true);
    }
    
    /**
     * Update visitor status
     */
    public Map<String, Object> updateVisitorStatus(Long id, String status) {
        // Placeholder
        return Map.of("success", true);
    }
    
    /**
     * Delete visitor
     */
    public void deleteVisitor(Long id) {
        // Placeholder
    }
    
    /**
     * Get all staff
     */
    public List<Map<String, Object>> getAllStaff() {
        // Placeholder
        return new ArrayList<>();
    }
    
    /**
     * Add staff
     */
    public Map<String, Object> addStaff(Map<String, String> body) {
        // Placeholder
        return Map.of("success", true);
    }
    
    /**
     * Record staff exit
     */
    public Map<String, Object> recordStaffExit(Long id) {
        // Placeholder
        return Map.of("success", true);
    }
    
    /**
     * Delete staff
     */
    public void deleteStaff(Long id) {
        // Placeholder
    }
    
    /**
     * Get all checkpoints
     */
    public List<Map<String, Object>> getAllCheckpoints() {
        // Placeholder
        return new ArrayList<>();
    }
    
    /**
     * Add checkpoint
     */
    public Map<String, Object> addCheckpoint(Map<String, String> body) {
        // Placeholder
        return Map.of("success", true);
    }
    
    /**
     * Get recent patrol logs
     */
    public List<Map<String, Object>> getRecentPatrolLogs() {
        // Placeholder
        return new ArrayList<>();
    }
    
    /**
     * Record patrol
     */
    public Map<String, Object> recordPatrol(Map<String, String> body) {
        // Placeholder
        return Map.of("success", true);
    }
    
    /**
     * Get all devices
     */
    public List<Map<String, Object>> getAllDevices() {
        // Placeholder
        return new ArrayList<>();
    }
    
    /**
     * Add device
     */
    public Map<String, Object> addDevice(Map<String, String> body) {
        // Placeholder
        return Map.of("success", true);
    }
    
    /**
     * Control device
     */
    public Map<String, Object> controlDevice(Long id, String action) {
        // Placeholder
        return Map.of("success", true);
    }
    
    /**
     * Delete device
     */
    public void deleteDevice(Long id) {
        // Placeholder
    }
    
    /**
     * Get all residents
     */
    public List<Map<String, Object>> getAllResidents() {
        // Placeholder
        return new ArrayList<>();
    }
    
    /**
     * Add resident
     */
    public Map<String, Object> addResident(Map<String, String> body) {
        // Placeholder
        return Map.of("success", true);
    }
    
    /**
     * Delete resident
     */
    public void deleteResident(Long id) {
        // Placeholder
    }
    
    /**
     * Delete resident by string ID
     */
    public void deleteResidentByStringId(String id) {
        // Placeholder
    }
    
    /**
     * Get logged vehicles
     */
    public List<Map<String, Object>> getLoggedVehicles() {
        // Placeholder
        return new ArrayList<>();
    }
}
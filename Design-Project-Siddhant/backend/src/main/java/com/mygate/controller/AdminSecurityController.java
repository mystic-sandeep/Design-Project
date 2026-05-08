package com.mygate.controller;

import com.mygate.dto.AdminCreationDTO;
import com.mygate.entity.User;
import com.mygate.security.Permissions;
import com.mygate.service.AdminService;
import com.mygate.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/admin/security")
@CrossOrigin(origins = "*")
public class AdminSecurityController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/stats")
    @Permissions("manage_admins")
    public ResponseEntity<Map<String, Object>> getStats(HttpServletRequest req) {
        try {
            Map<String, Object> stats = adminService.getDashboardStats();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Dashboard stats retrieved",
                    "data", stats
            ));
        } catch (Exception e) {
            log.error("Failed to get stats: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/users")
    @Permissions("view_all_users")
    public ResponseEntity<Map<String, Object>> getAllUsers(HttpServletRequest req) {
        try {
            List<Map<String, Object>> users = adminService.getAllUsers();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Users retrieved",
                    "data", Map.of("users", users, "total", users.size())
            ));
        } catch (Exception e) {
            log.error("Failed to get users: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/users/admin")
    @Permissions("manage_admins")
    public ResponseEntity<Map<String, Object>> createAdmin(
            @Valid @RequestBody AdminCreationDTO request,
            HttpServletRequest httpRequest) {
        try {
            String adminId = (String) httpRequest.getAttribute("userId");
            
            User newAdmin = userService.createAdminUser(
                    request.getEmail(),
                    request.getPhone(),
                    request.getPassword(),
                    request.getFullName(),
                    request.getEmployeeId(),
                    request.getDepartment(),
                    adminId
            );
            
            return ResponseEntity.status(201).body(Map.of(
                    "success", true,
                    "message", "Admin created successfully",
                    "data", Map.of(
                            "id", newAdmin.getId(),
                            "email", newAdmin.getEmail(),
                            "role", newAdmin.getRole().toString()
                    )
            ));
        } catch (Exception e) {
            log.error("Failed to create admin: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    @DeleteMapping("/users/{userId}")
    @Permissions("manage_admins")
    public ResponseEntity<Map<String, Object>> deactivateUser(
            @PathVariable String userId,
            HttpServletRequest httpRequest) {
        try {
            String adminId = (String) httpRequest.getAttribute("userId");
            String ipAddress = httpRequest.getRemoteAddr();
            
            adminService.deactivateUser(userId, adminId, ipAddress);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "User deactivated successfully"
            ));
        } catch (Exception e) {
            log.error("Failed to deactivate user: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/audit-logs")
    @Permissions("view_audit_logs")
    public ResponseEntity<Map<String, Object>> getAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String userId,
            @RequestParam(defaultValue = "100") int limit,
            HttpServletRequest req) {
        try {
            List<Map<String, Object>> logs = adminService.getAuditLogs(action, userId, limit);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Audit logs retrieved",
                    "data", Map.of("logs", logs, "total", logs.size())
            ));
        } catch (Exception e) {
            log.error("Failed to get audit logs: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/reports/activity")
    @Permissions("generate_reports")
    public ResponseEntity<Map<String, Object>> generateActivityReport(
            @RequestParam String startDate,
            @RequestParam String endDate,
            HttpServletRequest req) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            
            Map<String, Object> report = adminService.generateUserActivityReport(start, end);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Report generated",
                    "data", report
            ));
        } catch (Exception e) {
            log.error("Failed to generate report: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}

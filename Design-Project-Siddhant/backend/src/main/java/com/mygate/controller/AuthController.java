package com.mygate.controller;

import com.mygate.dto.*;
import com.mygate.entity.User;
import com.mygate.enums.Role;
import com.mygate.security.JwtUtil;
import com.mygate.service.AuthService;
import com.mygate.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Enhanced Login with proper authentication
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @Valid @RequestBody LoginRequestDTO request,
            HttpServletRequest httpRequest) {
        try {
            String ipAddress = httpRequest.getRemoteAddr();
            String userAgent = httpRequest.getHeader("User-Agent");
            
            Map<String, Object> response = authService.authenticateUser(
                    request.getEmail(),
                    request.getPassword(),
                    ipAddress,
                    userAgent
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Register new user (Admin only)
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @Valid @RequestBody UserRegistrationDTO request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        try {
            // Extract admin ID from token (if provided)
            String adminId = "SYSTEM";
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    adminId = jwtUtil.getUserIdFromToken(token);
                } catch (Exception e) {
                    log.warn("Could not extract admin ID from token");
                }
            }
            
            String ipAddress = httpRequest.getRemoteAddr();
            User newUser = null;
            
            switch (request.getRole().toUpperCase()) {
                case "ADMIN":
                    newUser = userService.createAdminUser(
                            request.getEmail(),
                            request.getPhone(),
                            request.getPassword(),
                            request.getFullName(),
                            request.getEmployeeId(),
                            request.getDepartment(),
                            adminId
                    );
                    break;
                case "GUARD":
                    newUser = userService.createGuardUser(
                            request.getEmail(),
                            request.getPhone(),
                            request.getPassword(),
                            request.getFullName(),
                            request.getEmployeeId(),
                            request.getShift(),
                            request.getAssignedGate(),
                            request.getBadgeNumber()
                    );
                    break;
                case "RESIDENT":
                    newUser = userService.createResidentUser(
                            request.getEmail(),
                            request.getPhone(),
                            request.getPassword(),
                            request.getFullName(),
                            request.getApartmentNumber(),
                            request.getBuilding(),
                            null
                    );
                    break;
                default:
                    throw new IllegalArgumentException("Invalid role: " + request.getRole());
            }
            
            return ResponseEntity.status(201).body(Map.of(
                    "success", true,
                    "message", "User registered successfully",
                    "user", Map.of(
                            "id", newUser.getId(),
                            "email", newUser.getEmail(),
                            "role", newUser.getRole().toString()
                    )
            ));
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Verify token and get user info
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "error", "Token missing"
                ));
            }

            String token = authHeader.substring(7);
            Map<String, Object> response = authService.verifyToken(token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Token verification failed: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Invalid or expired token"
            ));
        }
    }

    /**
     * Logout user
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String userId = jwtUtil.getUserIdFromToken(token);
                String ipAddress = httpRequest.getRemoteAddr();
                
                authService.logout(userId, ipAddress);
                
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Logged out successfully"
                ));
            }
            
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Token missing"
            ));
        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Logout failed"
            ));
        }
    }

    /**
     * Get current user info
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "error", "Token missing"
                ));
            }

            String token = authHeader.substring(7);
            String userId = jwtUtil.getUserIdFromToken(token);
            User user = userService.getUserById(userId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "user", Map.of(
                            "id", user.getId(),
                            "email", user.getEmail(),
                            "phone", user.getPhone(),
                            "role", user.getRole().toString(),
                            "isActive", user.getIsActive(),
                            "isVerified", user.getIsVerified(),
                            "lastLogin", user.getLastLogin()
                    )
            ));
        } catch (Exception e) {
            log.error("Failed to get current user: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Unauthorized"
            ));
        }
    }

    /**
     * Change password
     */
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "error", "Token missing"
                ));
            }

            String token = authHeader.substring(7);
            String userId = jwtUtil.getUserIdFromToken(token);
            String oldPassword = request.get("oldPassword");
            String newPassword = request.get("newPassword");
            String ipAddress = httpRequest.getRemoteAddr();
            
            authService.changePassword(userId, oldPassword, newPassword, ipAddress);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Password changed successfully"
            ));
        } catch (Exception e) {
            log.error("Password change failed: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}
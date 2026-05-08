package com.mygate.service;

import com.mygate.entity.User;
import com.mygate.repository.UserRepository;
import com.mygate.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Authentication service for login, registration, and token management
 */
@Slf4j
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordHashingService passwordHashingService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuditLogService auditLogService;
    
    @Autowired
    private SessionService sessionService;
    
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final long LOCKOUT_DURATION_MS = 900000; // 15 minutes
    
    /**
     * Authenticate user with email and password
     */
    @Transactional
    public Map<String, Object> authenticateUser(String email, String password, String ipAddress, String userAgent) {
        try {
            // Find user
            User user = userRepository.findByEmail(email.toLowerCase())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Check if user is active
            if (!user.getIsActive()) {
                auditLogService.logFailedLogin(email, ipAddress, "Account deactivated");
                throw new RuntimeException("Account is deactivated");
            }
            
            // Verify password
            if (!passwordHashingService.verifyPassword(password, user.getPasswordHash())) {
                auditLogService.logFailedLogin(email, ipAddress, "Invalid password");
                throw new RuntimeException("Invalid credentials");
            }
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
            
            // Log successful login
            auditLogService.logLogin(user.getId(), ipAddress, userAgent);
            
            log.info("User authenticated: {} ({})", email, user.getRole());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("user", Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "role", user.getRole().toString(),
                    "isActive", user.getIsActive(),
                    "isVerified", user.getIsVerified()
            ));
            
            return response;
        } catch (Exception e) {
            log.error("Authentication failed for email: {}", email, e);
            auditLogService.logFailedLogin(email, ipAddress, e.getMessage());
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }
    
    /**
     * Register a new user (admin only)
     */
    @Transactional
    public Map<String, Object> registerNewUser(String email, String phone, String password, String fullName,
                                               String role, String adminId, String ipAddress) {
        try {
            // Validate password strength
            if (!passwordHashingService.isStrongPassword(password)) {
                throw new IllegalArgumentException("Password is not strong enough");
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            
            // Registration logic handled by UserService
            // This is a wrapper for audit logging
            auditLogService.logAction(adminId, "USER_REGISTERED", "USER", null, null,
                    Map.of("email", email, "role", role), ipAddress, "SUCCESS", null);
            
            return response;
        } catch (Exception e) {
            log.error("Registration failed", e);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
    
    /**
     * Verify JWT token and extract user info
     */
    public Map<String, Object> verifyToken(String token) {
        try {
            if (!jwtUtil.validateToken(token)) {
                throw new RuntimeException("Invalid or expired token");
            }
            
            String userId = jwtUtil.getUserIdFromToken(token);
            User user = getUserById(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Token is valid");
            response.put("user", Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "role", user.getRole().toString()
            ));
            
            return response;
        } catch (Exception e) {
            log.error("Token verification failed", e);
            throw new RuntimeException("Token verification failed: " + e.getMessage());
        }
    }
    
    /**
     * Logout user and revoke session
     */
    @Transactional
    public void logout(String userId, String ipAddress) {
        try {
            sessionService.revokeAllSessionsForUser(userId);
            auditLogService.logAction(userId, "LOGOUT", "SESSION", userId, null,
                    Map.of("ip", ipAddress), ipAddress, "SUCCESS", null);
            
            log.info("User logged out: {}", userId);
        } catch (Exception e) {
            log.error("Logout failed", e);
            throw new RuntimeException("Logout failed: " + e.getMessage());
        }
    }
    
    /**
     * Get user by ID
     */
    private User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }
    
    /**
     * Change user password
     */
    @Transactional
    public void changePassword(String userId, String oldPassword, String newPassword, String ipAddress) {
        try {
            User user = getUserById(userId);
            
            // Verify old password
            if (!passwordHashingService.verifyPassword(oldPassword, user.getPasswordHash())) {
                throw new RuntimeException("Current password is incorrect");
            }
            
            // Validate new password strength
            if (!passwordHashingService.isStrongPassword(newPassword)) {
                throw new IllegalArgumentException("New password is not strong enough");
            }
            
            // Update password
            user.setPasswordHash(passwordHashingService.hashPassword(newPassword));
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            
            // Log the change
            auditLogService.logAction(userId, "PASSWORD_CHANGED", "USER", userId, null,
                    Map.of("passwordChanged", true), ipAddress, "SUCCESS", null);
            
            log.info("Password changed for user: {}", userId);
        } catch (Exception e) {
            log.error("Password change failed", e);
            throw new RuntimeException("Password change failed: " + e.getMessage());
        }
    }
}
package com.mygate.service;

import com.mygate.entity.*;
import com.mygate.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * User management service for creating and managing users across all roles
 */
@Slf4j
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private GuardRepository guardRepository;
    
    @Autowired
    private ResidentEnhancedRepository residentRepository;
    
    @Autowired
    private EncryptedCredentialsRepository encryptedCredentialsRepository;
    
    @Autowired
    private PasswordHashingService passwordHashingService;
    
    @Autowired
    private AuditLogService auditLogService;
    
    /**
     * Create a new ADMIN user
     */
    @Transactional
    public User createAdminUser(String email, String phone, String password, String fullName, 
                               String employeeId, String department, String createdByAdminId) {
        
        validateUserCreation(email, phone);
        
        // Create base user
        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .email(email.toLowerCase())
                .phone(phone)
                .passwordHash(passwordHashingService.hashPassword(password))
                .role(User.Role.ADMIN)
                .isActive(true)
                .isVerified(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        userRepository.save(user);
        
        // Create admin details
        Admin admin = Admin.builder()
                .id(user.getId())
                .user(user)
                .fullName(fullName)
                .employeeId(employeeId)
                .department(department)
                .createdBy(createdByAdminId)
                .createdAt(LocalDateTime.now())
                .build();
        
        adminRepository.save(admin);
        
        log.info("Admin user created: {} ({})", email, employeeId);
        return user;
    }
    
    /**
     * Create a new GUARD user
     */
    @Transactional
    public User createGuardUser(String email, String phone, String password, String fullName,
                               String employeeId, String shift, String assignedGate, String badgeNumber) {
        
        validateUserCreation(email, phone);
        
        // Create base user
        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .email(email.toLowerCase())
                .phone(phone)
                .passwordHash(passwordHashingService.hashPassword(password))
                .role(User.Role.GUARD)
                .isActive(true)
                .isVerified(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        userRepository.save(user);
        
        // Create guard details
        Guard guard = Guard.builder()
                .id(user.getId())
                .user(user)
                .fullName(fullName)
                .employeeId(employeeId)
                .shift(shift != null ? shift : "GENERAL")
                .assignedGate(assignedGate)
                .badgeNumber(badgeNumber)
                .createdAt(LocalDateTime.now())
                .build();
        
        guardRepository.save(guard);
        
        log.info("Guard user created: {} ({})", email, employeeId);
        return user;
    }
    
    /**
     * Create a new RESIDENT user
     */
    @Transactional
    public User createResidentUser(String email, String phone, String password, String fullName,
                                  String apartmentNumber, String building, LocalDate moveInDate) {
        
        validateUserCreation(email, phone);
        
        // Create base user
        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .email(email.toLowerCase())
                .phone(phone)
                .passwordHash(passwordHashingService.hashPassword(password))
                .role(User.Role.RESIDENT)
                .isActive(true)
                .isVerified(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        userRepository.save(user);
        
        // Create resident details
        ResidentEnhanced resident = ResidentEnhanced.builder()
                .id(user.getId())
                .user(user)
                .fullName(fullName)
                .apartmentNumber(apartmentNumber)
                .building(building)
                .moveInDate(moveInDate != null ? moveInDate : LocalDate.now())
                .createdAt(LocalDateTime.now())
                .build();
        
        residentRepository.save(resident);
        
        log.info("Resident user created: {} ({})", email, apartmentNumber);
        return user;
    }
    
    /**
     * Get user by email
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
    
    /**
     * Get user by ID
     */
    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }
    
    /**
     * Get all users by role
     */
    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRoleAndIsActiveTrue(role);
    }
    
    /**
     * Deactivate user account
     */
    @Transactional
    public void deactivateUser(String userId, String deactivatedByAdminId) {
        User user = getUserById(userId);
        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        auditLogService.logAction(deactivatedByAdminId, "USER_DEACTIVATED", "USER", userId,
                Map.of("isActive", true), Map.of("isActive", false), "N/A", "SUCCESS", null);
        
        log.info("User deactivated: {}", userId);
    }
    
    /**
     * Verify user email/phone
     */
    @Transactional
    public void verifyUser(String userId) {
        User user = getUserById(userId);
        user.setIsVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        log.info("User verified: {}", userId);
    }
    
    /**
     * Update last login timestamp
     */
    @Transactional
    public void updateLastLogin(String userId, String ipAddress) {
        User user = getUserById(userId);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        auditLogService.logLogin(userId, ipAddress, "N/A");
    }
    
    /**
     * Validate user creation requirements
     */
    private void validateUserCreation(String email, String phone) {
        if (email == null || email.isEmpty() || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        if (phone == null || phone.isEmpty() || phone.length() < 10) {
            throw new IllegalArgumentException("Invalid phone number");
        }
        
        if (userRepository.existsByEmail(email.toLowerCase())) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }
        
        if (userRepository.existsByPhone(phone)) {
            throw new IllegalArgumentException("Phone already exists: " + phone);
        }
    }
    
    /**
     * Check if user has permission
     */
    public boolean userHasPermission(String userId, String permission) {
        User user = getUserById(userId);
        // TODO: Implement permission check against role_permissions table
        return true;
    }
}
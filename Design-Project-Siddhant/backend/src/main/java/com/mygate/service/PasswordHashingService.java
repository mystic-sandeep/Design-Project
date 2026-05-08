package com.mygate.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordHashingService {
    
    private final BCryptPasswordEncoder passwordEncoder;
    
    public PasswordHashingService() {
        this.passwordEncoder = new BCryptPasswordEncoder(12);
    }
    
    /**
     * Hash a plain text password
     * Layer 3: Encryption (Transit) - BCrypt hashing
     */
    public String hashPassword(String plainPassword) {
        if (plainPassword == null || plainPassword.isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        return passwordEncoder.encode(plainPassword);
    }
    
    /**
     * Verify a plain text password against a hash
     */
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        if (plainPassword == null || hashedPassword == null) {
            return false;
        }
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
    
    /**
     * Check password strength
     */
    public boolean isStrongPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        boolean hasUpperCase = password.matches(".*[A-Z].*");
        boolean hasLowerCase = password.matches(".*[a-z].*");
        boolean hasDigit = password.matches(".*[0-9].*");
        boolean hasSpecialChar = password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*");
        
        return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
    }
}
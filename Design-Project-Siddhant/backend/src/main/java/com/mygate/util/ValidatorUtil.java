package com.mygate.util;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

public class ValidatorUtil {
    
    private static final Pattern EMAIL_PATTERN = 
            Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    
    private static final Pattern PHONE_PATTERN = 
            Pattern.compile("^[+]?[0-9]{10,13}$");
    
    private static final Pattern PASSWORD_PATTERN = 
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
    
    /**
     * Validate email format
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    /**
     * Validate phone format
     */
    public static boolean isValidPhone(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone).matches();
    }
    
    /**
     * Validate password strength
     */
    public static boolean isStrongPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }
    
    /**
     * Validate all fields and return errors
     */
    public static Map<String, String> validateUserRegistration(String email, String phone, String password) {
        Map<String, String> errors = new HashMap<>();
        
        if (!isValidEmail(email)) {
            errors.put("email", "Invalid email format");
        }
        
        if (!isValidPhone(phone)) {
            errors.put("phone", "Invalid phone format");
        }
        
        if (!isStrongPassword(password)) {
            errors.put("password", "Password must contain uppercase, lowercase, digit, and special character");
        }
        
        return errors;
    }
    
    /**
     * Sanitize input to prevent XSS
     */
    public static String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }
}
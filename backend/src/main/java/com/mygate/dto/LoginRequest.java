package com.mygate.dto;

/**
 * Login Request DTO
 * Used for user login with email, password, and role
 */
public class LoginRequest {
    private String email;
    private String password;
    private String role;
    
    // Default constructor
    public LoginRequest() {
    }
    
    // Constructor with all fields
    public LoginRequest(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }
    
    // ============ GETTERS ============
    
    public String getEmail() {
        return email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public String getRole() {
        return role;
    }
    
    // ============ SETTERS ============
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    // ============ toString (Optional) ============
    
    @Override
    public String toString() {
        return "LoginRequest{" +
                "email='" + email + '\'' +
                ", password='" + (password != null ? "***" : "null") + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
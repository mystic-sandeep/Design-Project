package com.mygate.controller;

import com.mygate.dto.LoginRequest;
import com.mygate.enums.Role;
import com.mygate.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Email is required"
            ));
        }
        
        // Validate role
        String roleStr = request.getRole() != null ? request.getRole() : "resident";
        try {
            Role.fromString(roleStr);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Invalid role. Must be: resident, guard, admin, staff, or maid"
            ));
        }
        
        String token = jwtUtil.generateToken(
                request.getEmail(),
                request.getEmail(),
                roleStr
        );
        
        Role role = Role.fromString(roleStr);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Login successful",
            "token", token,
            "user", Map.of(
                "email", request.getEmail(),
                "role", role.getDisplayName(),
                "permissions", role.getPermissions()
            )
        ));
    }
    
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyToken(@RequestHeader("Authorization") String authHeader) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "Token missing or invalid format"
            ));
        }
        
        String token = authHeader.substring(7);
        
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "Invalid or expired token"
            ));
        }
        
        String roleStr = jwtUtil.getRoleFromToken(token);
        Role role = Role.fromString(roleStr);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Token valid",
            "user", Map.of(
                "userId", jwtUtil.getUserIdFromToken(token),
                "email", jwtUtil.getEmailFromToken(token),
                "role", role.getDisplayName(),
                "permissions", role.getPermissions()
            )
        ));
    }
}
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

    // Hardcoded users (matches frontend demo credentials)
    private static final Map<String, String[]> USERS = new HashMap<>();
    static {
        // email -> [password, name, apartment]
        USERS.put("admin@mygate.com",    new String[]{"admin123",    "Admin User",     "A-001"});
        USERS.put("guard@mygate.com",    new String[]{"guard123",    "Security Guard", "G-001"});
        USERS.put("resident@mygate.com", new String[]{"resident123", "John Resident",  "B-202"});
        USERS.put("staff@mygate.com",    new String[]{"staff123",    "Staff Member",   "S-001"});
        USERS.put("maid@mygate.com",     new String[]{"maid123",     "Maid Worker",    null  });
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {

        String email    = request.getEmail();
        String password = request.getPassword();
        String roleStr  = request.getRole() != null ? request.getRole().toLowerCase() : "resident";

        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false, "error", "Email and password required"
            ));
        }

        // Validate role
        Role role;
        try {
            role = Role.fromString(roleStr);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false, "error", "Invalid role"
            ));
        }

        // Validate credentials
        String[] userData = USERS.get(email);
        if (userData == null || !userData[0].equals(password)) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false, "error", "Invalid credentials"
            ));
        }

        // Validate role matches email
        String expectedRole = email.split("@")[0]; // admin, guard, resident, staff, maid
        if (!roleStr.equals(expectedRole) && !roleStr.equals("admin")) {
            // Allow admin to log in as any role for demo
            if (!email.equals("admin@mygate.com")) {
                return ResponseEntity.status(403).body(Map.of(
                    "success", false, "error", "This account is not a " + roleStr
                ));
            }
        }

        String token = jwtUtil.generateToken(email, email, roleStr);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("user", Map.of(
            "id",          email,
            "email",       email,
            "name",        userData[1],
            "apartment",   userData[2] != null ? userData[2] : "",
            "role",        roleStr,
            "roleDisplay", role.getDisplayName(),
            "permissions", role.getPermissions()
        ));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false, "error", "Token missing"
            ));
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false, "error", "Invalid or expired token"
            ));
        }

        String roleStr = jwtUtil.getRoleFromToken(token);
        String email   = jwtUtil.getEmailFromToken(token);
        Role   role    = Role.fromString(roleStr);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Token valid",
            "user", Map.of(
                "id",          email,
                "email",       email,
                "role",        roleStr,
                "roleDisplay", role.getDisplayName(),
                "permissions", role.getPermissions()
            )
        ));
    }
}
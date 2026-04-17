package com.mygate.controller;

import com.mygate.dto.ApproveGuestRequest;
import com.mygate.dto.GuestResponse;
import com.mygate.dto.VerifyRequest;
import com.mygate.entity.Guest;
import com.mygate.security.JwtUtil;
import com.mygate.service.GuestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/guests")
@CrossOrigin(origins = "*")
public class GuestControllerV1 {
    
    @Autowired
    private GuestService guestService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
    
    private ResponseEntity<Map<String, Object>> validateJWT(String token) {
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "error", "Unauthorized - Token missing"
            ));
        }
        
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "error", "Unauthorized - Invalid token"
            ));
        }
        
        return null;
    }
    
    @PostMapping("/approve")
    public ResponseEntity<?> approveGuest(
            @Valid @RequestBody ApproveGuestRequest request,
            HttpServletRequest httpRequest) {
        
        String token = extractToken(httpRequest);
        ResponseEntity<Map<String, Object>> validation = validateJWT(token);
        if (validation != null) {
            return validation;
        }
        
        try {
            GuestResponse response = guestService.approveGuest(request);
            
            Map<String, Object> securedResponse = new HashMap<>();
            securedResponse.put("success", response.isSuccess());
            securedResponse.put("guestId", response.getGuestId());
            securedResponse.put("passCode", response.getPassCode());
            securedResponse.put("qrDataUrl", response.getQrDataUrl());
            securedResponse.put("message", response.getMessage());
            securedResponse.put("requestedBy", jwtUtil.getUserIdFromToken(token));
            
            return ResponseEntity.ok(securedResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verifyGuest(
            @RequestBody VerifyRequest request,
            HttpServletRequest httpRequest) {
        
        String token = extractToken(httpRequest);
        ResponseEntity<Map<String, Object>> validation = validateJWT(token);
        if (validation != null) {
            return validation;
        }
        
        try {
            Guest guest = guestService.verifyGuest(request.getPassCode());
            
            Map<String, Object> securedResponse = new HashMap<>();
            securedResponse.put("success", true);
            securedResponse.put("guest", guest);
            securedResponse.put("verifiedBy", jwtUtil.getUserIdFromToken(token));
            
            return ResponseEntity.ok(securedResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}
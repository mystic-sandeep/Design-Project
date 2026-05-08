package com.mygate.controller;

import com.mygate.dto.VisitorPassRequestDTO;
import com.mygate.security.Permissions;
import com.mygate.service.ResidentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/resident/security")
@CrossOrigin(origins = "*")
public class ResidentSecurityController {
    
    @Autowired
    private ResidentService residentService;
    
    /**
     * Get resident profile
     */
    @GetMapping("/profile")
    @Permissions("view_own_info")
    public ResponseEntity<Map<String, Object>> getProfile(
            HttpServletRequest httpRequest) {
        try {
            String residentId = (String) httpRequest.getAttribute("userId");
            
            Map<String, Object> profile = residentService.getResidentProfile(residentId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Profile retrieved",
                    "data", profile
            ));
        } catch (Exception e) {
            log.error("Failed to get profile: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Update resident profile
     */
    @PutMapping("/profile")
    @Permissions("view_own_info")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        try {
            String residentId = (String) httpRequest.getAttribute("userId");
            String ipAddress = httpRequest.getRemoteAddr();
            
            residentService.updateResidentProfile(
                    residentId,
                    request.get("emergencyContactName"),
                    request.get("emergencyContactPhone"),
                    request.get("vehicleNumber"),
                    ipAddress
            );
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Profile updated successfully"
            ));
        } catch (Exception e) {
            log.error("Failed to update profile: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Request visitor pass
     */
    @PostMapping("/visitor-pass")
    @Permissions("request_visitor_pass")
    public ResponseEntity<Map<String, Object>> requestVisitorPass(
            @Valid @RequestBody VisitorPassRequestDTO request,
            HttpServletRequest httpRequest) {
        try {
            String residentId = (String) httpRequest.getAttribute("userId");
            
            var pass = residentService.requestVisitorPass(
                    residentId,
                    request.getVisitorName(),
                    request.getVisitorContact(),
                    request.getVisitDate(),
                    request.getPurpose()
            );
            
            return ResponseEntity.status(201).body(Map.of(
                    "success", true,
                    "message", "Visitor pass requested successfully",
                    "data", Map.of(
                            "passId", pass.getId(),
                            "visitorName", pass.getVisitorName(),
                            "visitDate", pass.getVisitDate().toString(),
                            "status", pass.getStatus().toString()
                    )
            ));
        } catch (Exception e) {
            log.error("Failed to request visitor pass: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Get visitor pass history
     */
    @GetMapping("/visitor-passes")
    @Permissions("view_my_visitors")
    public ResponseEntity<Map<String, Object>> getVisitorPasses(
            HttpServletRequest httpRequest) {
        try {
            String residentId = (String) httpRequest.getAttribute("userId");
            
            List<Map<String, Object>> passes = residentService.getVisitorPassHistory(residentId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Visitor passes retrieved",
                    "data", Map.of("passes", passes, "total", passes.size())
            ));
        } catch (Exception e) {
            log.error("Failed to get visitor passes: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}
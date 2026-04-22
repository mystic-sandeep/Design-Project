package com.mygate.controller;

import com.mygate.enums.Role;
import com.mygate.security.Permissions;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.Random;

@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*")
public class RbacController {
    
    private static final Map<String, Map<String, Object>> pendingVisitors = new ConcurrentHashMap<>();
    
    // Queue to hold approvals until the guard dashboard fetches them
    private static final List<Map<String, Object>> approvedVisitorsQueue = new CopyOnWriteArrayList<>();
    private final Random random = new Random();

    private String generateComplexPasscode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 9; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        return code.toString();
    }

    // ============ GUARD ENDPOINTS ============
    
    @PostMapping("/guard/register-visitor")
    @Permissions("registerVisitor")
    public ResponseEntity<?> registerVisitor(HttpServletRequest request, @RequestBody Map<String, String> body) {
        String code = generateComplexPasscode();
        
        Map<String, Object> visitorData = new HashMap<>();
        visitorData.put("visitorName", body.get("visitorName"));
        visitorData.put("apartmentNumber", body.get("apartmentNumber"));
        visitorData.put("contactNumber", body.get("contactNumber"));
        visitorData.put("reasonOfVisit", body.get("reasonOfVisit"));
        visitorData.put("status", "Pending");
        visitorData.put("registeredAt", System.currentTimeMillis());
        
        pendingVisitors.put(code, visitorData);
        
        return buildResponse(request, "✅ Visitor registered", Map.of(
            "visitorName", body.get("visitorName"),
            "passCode", code
        ));
    }

    // NEW ENDPOINT: Guard uses this to check for resident approvals
    @GetMapping("/guard/poll-approvals")
    @Permissions("registerVisitor") 
    public ResponseEntity<?> pollApprovals(HttpServletRequest request) {
        // Fetch current approvals
        List<Map<String, Object>> recentApprovals = new ArrayList<>(approvedVisitorsQueue);
        // Clear the queue so we don't show the same popup twice
        approvedVisitorsQueue.clear(); 
        
        return buildResponse(request, "✅ Approvals fetched", Map.of("approvals", recentApprovals));
    }
    
    // ============ RESIDENT ENDPOINTS ============
    
    @PostMapping("/resident/approve-visitor")
    @Permissions("approveVisitor")
    public ResponseEntity<?> approveVisitor(HttpServletRequest request, @RequestBody Map<String, String> body) {
        String code = body.get("passCode");
        
        if (code == null || !pendingVisitors.containsKey(code)) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Invalid or expired passcode");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<String, Object> visitorData = pendingVisitors.get(code);
        visitorData.put("status", "Approved");
        visitorData.put("approvedAt", System.currentTimeMillis());
        
        pendingVisitors.remove(code);
        
        // Add to the new queue so the Guard dashboard can fetch it
        approvedVisitorsQueue.add(visitorData); 
        
        return buildResponse(request, "✅ Visitor approved", visitorData);
    }
    
    @GetMapping("/resident/bills")
    @Permissions("viewBills")
    public ResponseEntity<?> viewBills(HttpServletRequest request) { return buildResponse(request, "✅ Bills retrieved", Map.of("pendingAmount", 5000)); }
    
    @PostMapping("/resident/manage-vehicles")
    @Permissions("manageVehicles")
    public ResponseEntity<?> manageVehicles(HttpServletRequest request) { return buildResponse(request, "✅ Vehicle registered", Map.of("status", "Logged")); }
    
    @PostMapping("/resident/file-complaint")
    @Permissions("fileComplaint")
    public ResponseEntity<?> fileComplaint(HttpServletRequest request) { return buildResponse(request, "✅ Complaint filed", Map.of("status", "Open")); }
    
    @PostMapping("/resident/hire-maid")
    @Permissions("hireMaid")
    public ResponseEntity<?> hireMaid(HttpServletRequest request) { return buildResponse(request, "✅ Maid hired", Map.of("status", "Hired")); }
    
    @PostMapping("/guard/mark-entry")
    @Permissions("markEntry")
    public ResponseEntity<?> markEntry(HttpServletRequest request) { return buildResponse(request, "✅ Entry marked", Map.of()); }
    
    @PostMapping("/guard/mark-exit")
    @Permissions("markExit")
    public ResponseEntity<?> markExit(HttpServletRequest request) { return buildResponse(request, "✅ Exit marked", Map.of()); }
    
    @PostMapping("/guard/log-vehicle")
    @Permissions("logVehicle")
    public ResponseEntity<?> logVehicle(HttpServletRequest request) { return buildResponse(request, "✅ Vehicle logged", Map.of()); }
    
    @PostMapping("/guard/check-in")
    @Permissions("checkIn")
    public ResponseEntity<?> guardCheckIn(HttpServletRequest request) { return buildResponse(request, "✅ Guard checked in", Map.of()); }
    
    @PostMapping("/guard/check-out")
    @Permissions("checkOut")
    public ResponseEntity<?> guardCheckOut(HttpServletRequest request) { return buildResponse(request, "✅ Guard checked out", Map.of()); }
    
    // ============ UTILITY METHODS ============
    
    private ResponseEntity<?> buildResponse(HttpServletRequest request, String message, Map<String, Object> data) {
        Role userRole = (Role) request.getAttribute("userRole");
        String userId = (String) request.getAttribute("userId");
        String userEmail = (String) request.getAttribute("userEmail");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        response.put("executedBy", Map.of("userId", userId, "email", userEmail, "role", userRole.getDisplayName()));
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}
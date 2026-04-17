package com.mygate.controller;

import com.mygate.enums.Role;
import com.mygate.security.Permissions;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * RBAC Endpoints - Role-Based Access Control
 */
@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*")
public class RbacController {
    
    // ============ RESIDENT ENDPOINTS ============
    
    @PostMapping("/resident/approve-visitor")
    @Permissions("approveVisitor")
    public ResponseEntity<?> approveVisitor(HttpServletRequest request, @RequestBody Map<String, String> body) {
        return buildResponse(request, "✅ Visitor approved", Map.of(
            "visitorName", body.getOrDefault("visitorName", "John Doe"),
            "visitorPhone", body.getOrDefault("visitorPhone", "9876543210"),
            "approvedAt", System.currentTimeMillis()
        ));
    }
    
    @GetMapping("/resident/bills")
    @Permissions("viewBills")
    public ResponseEntity<?> viewBills(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return buildResponse(request, "✅ Bills retrieved", Map.of(
            "residentId", userId,
            "totalBills", 5,
            "pendingAmount", 5000,
            "bills", new Object[]{
                Map.of("id", "B001", "month", "April 2026", "amount", 1000, "status", "paid"),
                Map.of("id", "B002", "month", "May 2026", "amount", 1000, "status", "pending")
            }
        ));
    }
    
    @PostMapping("/resident/manage-vehicles")
    @Permissions("manageVehicles")
    public ResponseEntity<?> manageVehicles(HttpServletRequest request, @RequestBody Map<String, String> body) {
        return buildResponse(request, "✅ Vehicle registered", Map.of(
            "vehicleNumber", body.getOrDefault("vehicleNumber", "MH01AB1234"),
            "vehicleType", body.getOrDefault("vehicleType", "Car"),
            "registeredAt", System.currentTimeMillis()
        ));
    }
    
    @PostMapping("/resident/file-complaint")
    @Permissions("fileComplaint")
    public ResponseEntity<?> fileComplaint(HttpServletRequest request, @RequestBody Map<String, String> body) {
        return buildResponse(request, "✅ Complaint filed", Map.of(
            "complaintId", "C001",
            "title", body.getOrDefault("title", "Complaint title"),
            "description", body.getOrDefault("description", "Complaint details"),
            "status", "Open",
            "filedAt", System.currentTimeMillis()
        ));
    }
    
    @PostMapping("/resident/hire-maid")
    @Permissions("hireMaid")
    public ResponseEntity<?> hireMaid(HttpServletRequest request, @RequestBody Map<String, String> body) {
        return buildResponse(request, "✅ Maid hired", Map.of(
            "maidId", "M001",
            "maidName", body.getOrDefault("maidName", "Maria"),
            "salary", 5000,
            "startDate", System.currentTimeMillis()
        ));
    }
    
    // ============ GUARD ENDPOINTS ============
    
    @PostMapping("/guard/register-visitor")
    @Permissions("registerVisitor")
    public ResponseEntity<?> registerVisitor(HttpServletRequest request, @RequestBody Map<String, String> body) {
        return buildResponse(request, "✅ Visitor registered", Map.of(
            "visitorId", "V001",
            "visitorName", body.getOrDefault("visitorName", "Guest"),
            "registeredAt", System.currentTimeMillis(),
            "passCode", "ABC123DEF456"
        ));
    }
    
    @PostMapping("/guard/mark-entry")
    @Permissions("markEntry")
    public ResponseEntity<?> markEntry(HttpServletRequest request, @RequestBody Map<String, String> body) {
        return buildResponse(request, "✅ Entry marked", Map.of(
            "visitorId", body.getOrDefault("visitorId", "V001"),
            "entryTime", System.currentTimeMillis(),
            "status", "Entered"
        ));
    }
    
    @PostMapping("/guard/mark-exit")
    @Permissions("markExit")
    public ResponseEntity<?> markExit(HttpServletRequest request, @RequestBody Map<String, String> body) {
        return buildResponse(request, "✅ Exit marked", Map.of(
            "visitorId", body.getOrDefault("visitorId", "V001"),
            "exitTime", System.currentTimeMillis(),
            "status", "Exited"
        ));
    }
    
    @PostMapping("/guard/log-vehicle")
    @Permissions("logVehicle")
    public ResponseEntity<?> logVehicle(HttpServletRequest request, @RequestBody Map<String, String> body) {
        return buildResponse(request, "✅ Vehicle logged", Map.of(
            "vehicleNumber", body.getOrDefault("vehicleNumber", "MH01AB1234"),
            "entryTime", System.currentTimeMillis(),
            "status", "Logged"
        ));
    }
    
    @PostMapping("/guard/check-in")
    @Permissions("checkIn")
    public ResponseEntity<?> guardCheckIn(HttpServletRequest request) {
        return buildResponse(request, "✅ Guard checked in", Map.of(
            "checkInTime", System.currentTimeMillis(),
            "shift", "Morning (6 AM - 2 PM)"
        ));
    }
    
    @PostMapping("/guard/check-out")
    @Permissions("checkOut")
    public ResponseEntity<?> guardCheckOut(HttpServletRequest request) {
        return buildResponse(request, "✅ Guard checked out", Map.of(
            "checkOutTime", System.currentTimeMillis(),
            "duration", "8 hours"
        ));
    }
    
    // ============ ADMIN ENDPOINTS ============
    
    @PostMapping("/admin/generate-billing")
    @Permissions("generateBilling")
    public ResponseEntity<?> generateBilling(HttpServletRequest request, @RequestBody Map<String, String> body) {
        return buildResponse(request, "✅ Billing generated", Map.of(
            "billingId", "BL001",
            "month", body.getOrDefault("month", "April 2026"),
            "totalAmount", 150000,
            "generatedAt", System.currentTimeMillis()
        ));
    }
    
    @GetMapping("/admin/track-staff")
    @Permissions("trackStaff")
    public ResponseEntity<?> trackStaff(HttpServletRequest request) {
        return buildResponse(request, "✅ Staff tracking data", Map.of(
            "totalStaff", 25,
            "presentToday", 24,
            "absent", 1,
            "staff", new Object[]{
                Map.of("id", "S001", "name", "Rajesh", "status", "Present", "checkInTime", "7:00 AM"),
                Map.of("id", "S002", "name", "Priya", "status", "Present", "checkInTime", "6:30 AM"),
                Map.of("id", "S003", "name", "Kumar", "status", "Absent")
            }
        ));
    }
    
    @PostMapping("/admin/send-announcement")
    @Permissions("sendAnnouncement")
    public ResponseEntity<?> sendAnnouncement(HttpServletRequest request, @RequestBody Map<String, String> body) {
        return buildResponse(request, "✅ Announcement sent", Map.of(
            "announcementId", "A001",
            "title", body.getOrDefault("title", "Important Notice"),
            "message", body.getOrDefault("message", "Announcement details"),
            "sentTo", "All residents",
            "sentAt", System.currentTimeMillis()
        ));
    }
    
    @GetMapping("/admin/users")
    @Permissions("manageUsers")
    public ResponseEntity<?> manageUsers(HttpServletRequest request) {
        return buildResponse(request, "✅ Users data", Map.of(
            "totalUsers", 250,
            "residents", 200,
            "guards", 20,
            "staff", 25,
            "maids", 5
        ));
    }
    
    // ============ STAFF ENDPOINTS ============
    
    @PostMapping("/staff/check-in")
    @Permissions("checkIn")
    public ResponseEntity<?> staffCheckIn(HttpServletRequest request) {
        return buildResponse(request, "✅ Staff checked in", Map.of(
            "checkInTime", System.currentTimeMillis(),
            "shift", "Morning (8 AM - 4 PM)",
            "status", "Checked In"
        ));
    }
    
    @PostMapping("/staff/check-out")
    @Permissions("checkOut")
    public ResponseEntity<?> staffCheckOut(HttpServletRequest request) {
        return buildResponse(request, "✅ Staff checked out", Map.of(
            "checkOutTime", System.currentTimeMillis(),
            "totalHours", 8,
            "status", "Checked Out"
        ));
    }
    
    @GetMapping("/staff/tasks")
    @Permissions("viewTasks")
    public ResponseEntity<?> viewTasks(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return buildResponse(request, "✅ Tasks retrieved", Map.of(
            "staffId", userId,
            "totalTasks", 5,
            "completedTasks", 3,
            "tasks", new Object[]{
                Map.of("id", "T001", "title", "Clean lobby", "status", "Completed"),
                Map.of("id", "T002", "title", "Fix water tap", "status", "In Progress"),
                Map.of("id", "T003", "title", "Paint walls", "status", "Pending")
            }
        ));
    }
    
    // ============ MAID ENDPOINTS ============
    
    @PostMapping("/maid/check-in")
    @Permissions("checkIn")
    public ResponseEntity<?> maidCheckIn(HttpServletRequest request) {
        return buildResponse(request, "✅ Maid checked in", Map.of(
            "checkInTime", System.currentTimeMillis(),
            "shift", "Full time",
            "status", "Checked In"
        ));
    }
    
    @PostMapping("/maid/check-out")
    @Permissions("checkOut")
    public ResponseEntity<?> maidCheckOut(HttpServletRequest request) {
        return buildResponse(request, "✅ Maid checked out", Map.of(
            "checkOutTime", System.currentTimeMillis(),
            "totalHours", 8,
            "status", "Checked Out"
        ));
    }
    
    @GetMapping("/maid/assignments")
    @Permissions("viewAssignments")
    public ResponseEntity<?> viewAssignments(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return buildResponse(request, "✅ Assignments retrieved", Map.of(
            "maidId", userId,
            "totalAssignments", 4,
            "completedAssignments", 2,
            "assignments", new Object[]{
                Map.of("id", "A001", "flatNo", "A101", "task", "Cleaning", "status", "Completed"),
                Map.of("id", "A002", "flatNo", "A102", "task", "Laundry", "status", "In Progress"),
                Map.of("id", "A003", "flatNo", "A103", "task", "Cooking", "status", "Pending")
            }
        ));
    }
    
    // ============ UTILITY METHODS ============
    
    /**
     * Build standardized response with user info
     */
    private ResponseEntity<?> buildResponse(HttpServletRequest request, String message, Map<String, Object> data) {
        Role userRole = (Role) request.getAttribute("userRole");
        String userId = (String) request.getAttribute("userId");
        String userEmail = (String) request.getAttribute("userEmail");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        response.put("executedBy", Map.of(
            "userId", userId,
            "email", userEmail,
            "role", userRole.getDisplayName()
        ));
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}
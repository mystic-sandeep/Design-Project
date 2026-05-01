package com.mygate.controller;

import com.mygate.security.Permissions;
import com.mygate.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v2/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired private AdminService adminService;

    @GetMapping("/stats")
    @Permissions("manageUsers")
    public ResponseEntity<?> getStats(HttpServletRequest req) {
        return ok(req, "Stats fetched", adminService.getDashboardStats());
    }

    @GetMapping("/visitors")
    @Permissions("manageUsers")
    public ResponseEntity<?> getVisitors(HttpServletRequest req) {
        return ok(req, "Visitors fetched", Map.of("visitors", adminService.getAllVisitors()));
    }

    @PostMapping("/visitors")
    @Permissions("manageUsers")
    public ResponseEntity<?> addVisitor(HttpServletRequest req, @RequestBody Map<String, String> body) {
        return ok(req, "Visitor added", adminService.addVisitor(body));
    }

    @PutMapping("/visitors/{id}/status")
    @Permissions("manageUsers")
    public ResponseEntity<?> updateVisitorStatus(HttpServletRequest req,
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ok(req, "Status updated", adminService.updateVisitorStatus(id, body.get("status")));
    }

    @DeleteMapping("/visitors/{id}")
    @Permissions("manageUsers")
    public ResponseEntity<?> deleteVisitor(HttpServletRequest req, @PathVariable Long id) {
        adminService.deleteVisitor(id);
        return ok(req, "Visitor deleted", Map.of());
    }

    @GetMapping("/staff")
    @Permissions("manageUsers")
    public ResponseEntity<?> getStaff(HttpServletRequest req) {
        return ok(req, "Staff fetched", Map.of("staff", adminService.getAllStaff()));
    }

    @PostMapping("/staff")
    @Permissions("manageUsers")
    public ResponseEntity<?> addStaff(HttpServletRequest req, @RequestBody Map<String, String> body) {
        return ok(req, "Staff entry recorded", adminService.addStaff(body));
    }

    @PostMapping("/staff/{id}/exit")
    @Permissions("manageUsers")
    public ResponseEntity<?> staffExit(HttpServletRequest req, @PathVariable Long id) {
        return ok(req, "Exit recorded", adminService.recordStaffExit(id));
    }

    @DeleteMapping("/staff/{id}")
    @Permissions("manageUsers")
    public ResponseEntity<?> deleteStaff(HttpServletRequest req, @PathVariable Long id) {
        adminService.deleteStaff(id);
        return ok(req, "Staff deleted", Map.of());
    }

    @GetMapping("/patrol/checkpoints")
    @Permissions("manageUsers")
    public ResponseEntity<?> getCheckpoints(HttpServletRequest req) {
        return ok(req, "Checkpoints fetched", Map.of("checkpoints", adminService.getAllCheckpoints()));
    }

    @PostMapping("/patrol/checkpoints")
    @Permissions("manageUsers")
    public ResponseEntity<?> addCheckpoint(HttpServletRequest req, @RequestBody Map<String, String> body) {
        return ok(req, "Checkpoint added", adminService.addCheckpoint(body));
    }

    @GetMapping("/patrol/logs")
    @Permissions("manageUsers")
    public ResponseEntity<?> getPatrolLogs(HttpServletRequest req) {
        return ok(req, "Patrol logs fetched", Map.of("logs", adminService.getRecentPatrolLogs()));
    }

    @PostMapping("/patrol/log")
    @Permissions("manageUsers")
    public ResponseEntity<?> recordPatrol(HttpServletRequest req, @RequestBody Map<String, String> body) {
        return ok(req, "Patrol logged", adminService.recordPatrol(body));
    }

    @GetMapping("/devices")
    @Permissions("manageUsers")
    public ResponseEntity<?> getDevices(HttpServletRequest req) {
        return ok(req, "Devices fetched", Map.of("devices", adminService.getAllDevices()));
    }

    @PostMapping("/devices")
    @Permissions("manageUsers")
    public ResponseEntity<?> addDevice(HttpServletRequest req, @RequestBody Map<String, String> body) {
        return ok(req, "Device added", adminService.addDevice(body));
    }

    @PutMapping("/devices/{id}/control")
    @Permissions("manageUsers")
    public ResponseEntity<?> controlDevice(HttpServletRequest req,
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ok(req, "Device controlled", adminService.controlDevice(id, body.get("action")));
    }

    @DeleteMapping("/devices/{id}")
    @Permissions("manageUsers")
    public ResponseEntity<?> deleteDevice(HttpServletRequest req, @PathVariable Long id) {
        adminService.deleteDevice(id);
        return ok(req, "Device deleted", Map.of());
    }

    @GetMapping("/residents")
    @Permissions("manageUsers")
    public ResponseEntity<?> getResidents(HttpServletRequest req) {
        return ok(req, "Residents fetched", Map.of("residents", adminService.getAllResidents()));
    }

    @PostMapping("/residents")
    @Permissions("manageUsers")
    public ResponseEntity<?> addResident(HttpServletRequest req, @RequestBody Map<String, String> body) {
        return ok(req, "Resident added", adminService.addResident(body));
    }

    @DeleteMapping("/residents/{id}")
    @Permissions("manageUsers")
    public ResponseEntity<?> deleteResident(HttpServletRequest req, @PathVariable String id) {
        // Resident ID is a String (e.g. flat number "A-101")
        try {
            adminService.deleteResident(Long.parseLong(id));
        } catch (NumberFormatException e) {
            adminService.deleteResidentByStringId(id);
        }
        return ok(req, "Resident deleted", Map.of());
    }

    @GetMapping("/vehicles")
    @Permissions("manageUsers")
    public ResponseEntity<?> getVehicles(HttpServletRequest req) {
        return ok(req, "Vehicles fetched", Map.of("vehicles", adminService.getLoggedVehicles()));
    }

    private ResponseEntity<?> ok(HttpServletRequest req, String msg, Map<String, Object> data) {
        com.mygate.enums.Role role = (com.mygate.enums.Role) req.getAttribute("userRole");
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("success", true);
        resp.put("message", msg);
        resp.put("data", data);
        resp.put("executedBy", Map.of(
            "userId", req.getAttribute("userId") != null ? req.getAttribute("userId") : "admin",
            "email",  req.getAttribute("userEmail") != null ? req.getAttribute("userEmail") : "",
            "role",   role != null ? role.getDisplayName() : "Admin"
        ));
        resp.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(resp);
    }
}
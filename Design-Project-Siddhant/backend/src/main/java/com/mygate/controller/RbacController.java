package com.mygate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.*;

@RestController
@RequestMapping("/api/v2/rbac")
@CrossOrigin(origins = "*")
public class RbacController {

    private static final Map<String, Map<String, Object>> pendingVisitors = new ConcurrentHashMap<>();
    private static final List<Map<String, Object>> approvedVisitorsQueue = new CopyOnWriteArrayList<>();

    @Autowired
    private com.mygate.service.VehicleLogStore vehicleLogStore;

    private final Random random = new Random();

    private String generatePasscode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        return code.toString();
    }

    // ================= REGISTER VISITOR =================
    @PostMapping("/guard/register-visitor")
    public ResponseEntity<?> registerVisitor(@RequestBody Map<String, String> body) {

        String code = generatePasscode();

        Map<String, Object> visitor = new HashMap<>();
        visitor.put("visitorName", body.get("visitorName"));
        visitor.put("status", "Pending");
        visitor.put("time", new Date());

        pendingVisitors.put(code, visitor);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of("passCode", code)
        ));
    }

    // ================= APPROVE VISITOR =================
    @PostMapping("/resident/approve-visitor")
    public ResponseEntity<?> approveVisitor(@RequestBody Map<String, String> body) {

        String code = body.get("passCode");

        if (code == null || !pendingVisitors.containsKey(code)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Invalid passcode"
            ));
        }

        Map<String, Object> visitor = pendingVisitors.remove(code);
        visitor.put("status", "Approved");

        approvedVisitorsQueue.add(visitor);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", visitor
        ));
    }

    // ================= VERIFY (POLL) =================
    @GetMapping("/guard/poll-approvals")
    public ResponseEntity<?> pollApprovals() {

        List<Map<String, Object>> approvals = new ArrayList<>(approvedVisitorsQueue);
        approvedVisitorsQueue.clear();

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of("approvals", approvals)
        ));
    }

    // ================= LOG VEHICLE =================
    @PostMapping("/guard/log-vehicle")
    public ResponseEntity<?> logVehicle(@RequestBody Map<String, String> body) {

        Map<String, Object> vehicle = new HashMap<>();
        vehicle.put("vehicleNumber", body.get("vehicleNumber"));
        vehicle.put("category", body.get("category"));
        vehicle.put("time", new Date());

        vehicleLogStore.addVehicle(vehicle);

        return ResponseEntity.ok(Map.of("success", true));
    }

    // ================= GET VEHICLES =================
    @GetMapping("/vehicles")
    public ResponseEntity<?> getVehicles() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", vehicleLogStore.getVehicles()
        ));
    }
}
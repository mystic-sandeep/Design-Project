package com.mygate.controller;

import com.mygate.entity.Guest;
import com.mygate.entity.GuestStatus;
import com.mygate.entity.Visitor;
import com.mygate.repository.GuestRepository;
import com.mygate.repository.VisitorRepository;
import com.mygate.security.Permissions;
import com.mygate.service.VehicleLogStore;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/v2/guard")
@CrossOrigin(origins = "*")
public class GuardApiController {

    @Autowired private GuestRepository    guestRepository;
    @Autowired private VisitorRepository  visitorRepository;
    @Autowired private VehicleLogStore    vehicleLogStore;
    @Autowired 
    private com.mygate.repository.StaffRepository staffRepository;

    // In-memory queue for real-time approval popups
    private static final List<Map<String, Object>> approvedQueue = new CopyOnWriteArrayList<>();

    // Public helper so ResidentApiController can inject approvals here
    public static void pushApprovalNotification(Map<String, Object> approvalData) {
        approvedQueue.add(approvalData);
    }
    private String genPasscode() {
        String c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder();
        Random r = new Random();
        for (int i = 0; i < 8; i++) sb.append(c.charAt(r.nextInt(c.length())));
        return sb.toString();
    }

    // ── Register visitor → saved to H2 VISITORS table ─────────────────────
    @PostMapping("/register-visitor")
    @Permissions("registerVisitor")
    public ResponseEntity<?> registerVisitor(
            HttpServletRequest req,
            @RequestBody Map<String, String> body) {

        String visitorName     = body.get("visitorName");
        String apartmentNumber = body.getOrDefault("apartmentNumber", "");
        String contactNumber   = body.getOrDefault("contactNumber", "");
        String reasonOfVisit   = body.getOrDefault("reasonOfVisit", "");

        if (visitorName == null || visitorName.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false, "error", "visitorName required"
            ));
        }

        String passCode = genPasscode();

        // Save to VISITORS table in H2
        Visitor visitor = new Visitor();
        visitor.setName(visitorName);
        visitor.setVisitorType("guest");
        visitor.setPhone(contactNumber);
        visitor.setStatus("pending");
        visitor.setArrivalTime(LocalDateTime.now());
        visitor.setApartmentNumber(apartmentNumber);
        visitor.setReasonOfVisit(reasonOfVisit);
        visitorRepository.save(visitor);  // ✅ SAVES TO H2

        // Also save as Guest (for passcode lookup)
        Guest guest = new Guest();
        guest.setId(passCode);
        guest.setPassCode(passCode);
        guest.setName(visitorName);
        guest.setResidentId(apartmentNumber);
        guest.setPhone(contactNumber);
        guest.setPurpose(reasonOfVisit);
        guest.setStatus(GuestStatus.APPROVED);
        guest.setApprovedAt(LocalDateTime.now());
        guestRepository.save(guest);  // ✅ SAVES TO H2

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "✅ Visitor registered",
            "data", Map.of(
                "passCode",        passCode,
                "visitorName",     visitorName,
                "apartmentNumber", apartmentNumber
            )
        ));
    }

    // ── Poll approvals (real-time popup for guard) ─────────────────────────
    @GetMapping("/poll-approvals")
    @Permissions("registerVisitor")
    public ResponseEntity<?> pollApprovals(HttpServletRequest req) {
        List<Map<String, Object>> approvals = new ArrayList<>(approvedQueue);
        approvedQueue.clear();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "✅ Approvals fetched",
            "data", Map.of("approvals", approvals)
        ));
    }

    // ── Log vehicle → saved to H2 via VehicleLogStore ─────────────────────
    @PostMapping("/log-vehicle")
    @Permissions("logVehicle")
    public ResponseEntity<?> logVehicle(
            HttpServletRequest req,
            @RequestBody Map<String, String> body) {

        String vehicleNumber = body.get("vehicleNumber");
        if (vehicleNumber == null || vehicleNumber.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false, "error", "vehicleNumber required"
            ));
        }

        String timeLogged = LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("hh:mm a"));

        Map<String, Object> vehicleData = new HashMap<>();
        vehicleData.put("vehicleNumber", vehicleNumber);
        vehicleData.put("category",      body.getOrDefault("category", "Car"));
        vehicleData.put("ownerName",     body.getOrDefault("ownerName", ""));
        vehicleData.put("timeLogged",    timeLogged);
        vehicleData.put("timestamp",     System.currentTimeMillis());
        vehicleLogStore.addVehicle(vehicleData);  // ✅ SAVES TO H2 via VehicleLogStore

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "✅ Vehicle logged",
            "data", vehicleData
        ));
    }

    @PostMapping("/mark-entry")  @Permissions("markEntry")  public ResponseEntity<?> markEntry (HttpServletRequest r) { return ok("✅ Entry marked");  }
    @PostMapping("/mark-exit")   @Permissions("markExit")   public ResponseEntity<?> markExit  (HttpServletRequest r) { return ok("✅ Exit marked");   }
    @PostMapping("/check-in")
    @Permissions("checkIn")
    public ResponseEntity<?> checkIn(HttpServletRequest r) {
        // Grab the guard's email from the JWT token we authenticated
        String email = (String) r.getAttribute("userEmail");
        String guardName = (email != null && !email.isEmpty()) ? email.split("@")[0] : "Security Guard";

        // Create a new staff record in the database
        com.mygate.entity.StaffMember shift = new com.mygate.entity.StaffMember();
        shift.setName(guardName); // Will show up as "guard" or "Security Guard"
        shift.setType("Guard");
        shift.setEntryTime(LocalDateTime.now());
        
        staffRepository.save(shift); // ✅ ACTUALLY SAVES TO DB

        return ok("✅ Checked in");
    }

    @PostMapping("/check-out")
    @Permissions("checkOut")
    public ResponseEntity<?> checkOut(HttpServletRequest r) {
        String email = (String) r.getAttribute("userEmail");
        String guardName = (email != null && !email.isEmpty()) ? email.split("@")[0] : "Security Guard";

        // Find the guard's current open shift and close it
        List<com.mygate.entity.StaffMember> logs = staffRepository.findAllByOrderByEntryTimeDesc();
        for (com.mygate.entity.StaffMember log : logs) {
            if ("Guard".equals(log.getType()) && log.getName().equals(guardName) && log.getExitTime() == null) {
                log.setExitTime(LocalDateTime.now());
                staffRepository.save(log); // ✅ SAVES THE CHECKOUT TIME
                break;
            }
        }

        return ok("✅ Checked out");
    }
// 🚦 Fetch pending visitors for the Guard Dashboard
    @GetMapping("/pending-visitors")
    @Permissions("registerVisitor")
    public ResponseEntity<?> getPendingVisitors() {
        List<Map<String, Object>> pending = visitorRepository.findAllByOrderByIdDesc().stream()
            .filter(v -> "pending".equalsIgnoreCase(v.getStatus()))
            .map(v -> {
                Map<String, Object> map = new HashMap<>();
                map.put("visitorName", v.getName());
                map.put("apartmentNumber", v.getApartmentNumber() != null ? v.getApartmentNumber() : "N/A");
                map.put("reason", v.getReasonOfVisit() != null ? v.getReasonOfVisit() : "Visitor");
                return map;
            }).toList();

        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", Map.of("visitors", pending)
        ));
    }

    private ResponseEntity<?> ok(String msg) {
        return ResponseEntity.ok(Map.of("success", true, "message", msg, "data", Map.of()));
    }
}
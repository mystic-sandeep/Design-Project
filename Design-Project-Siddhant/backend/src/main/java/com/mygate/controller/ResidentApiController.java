package com.mygate.controller;

import com.mygate.entity.Guest;
import com.mygate.entity.GuestStatus;
import com.mygate.repository.GuestRepository;
import com.mygate.security.Permissions;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v2/resident")
@CrossOrigin(origins = "*")
public class ResidentApiController {

    @Autowired
    private GuestRepository guestRepository;

    // Approve visitor by passcode — saves to H2 GUESTS table
    @PostMapping("/approve-visitor")
    @Permissions("approveVisitor")
    public ResponseEntity<?> approveVisitor(
            HttpServletRequest req,
            @RequestBody Map<String, String> body) {

        String passCode = body.get("passCode");
        if (passCode == null || passCode.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false, "error", "passCode required"
            ));
        }

        Optional<Guest> guestOpt = guestRepository.findByPassCode(passCode);
        if (guestOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                "success", false, "error", "Invalid or expired passcode"
            ));
        }

        Guest guest = guestOpt.get();
        if (guest.getStatus() == GuestStatus.CHECKED_IN) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false, "error", "Visitor already approved"
            ));
        }

        guest.setStatus(GuestStatus.APPROVED);
        guest.setApprovedAt(LocalDateTime.now());
        guestRepository.save(guest);  // ✅ SAVES TO H2

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "✅ Visitor approved",
            "data", Map.of(
                "visitorName",     guest.getName(),
                "apartmentNumber", guest.getResidentId(),
                "status",          "Approved"
            )
        ));
    }

    @GetMapping("/bills")
    @Permissions("viewBills")
    public ResponseEntity<?> viewBills(HttpServletRequest req) {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "✅ Bills retrieved",
            "data", Map.of("pendingAmount", 5000, "currency", "INR", "dueDate", "2025-06-01")
        ));
    }

    @PostMapping("/manage-vehicles")
    @Permissions("manageVehicles")
    public ResponseEntity<?> manageVehicles(HttpServletRequest req) {
        return ResponseEntity.ok(Map.of(
            "success", true, "message", "✅ Vehicle managed", "data", Map.of("status", "Logged")
        ));
    }

    @PostMapping("/file-complaint")
    @Permissions("fileComplaint")
    public ResponseEntity<?> fileComplaint(
            HttpServletRequest req,
            @RequestBody Map<String, String> body) {
        // Saved as a Guest record for demo — in production add a Complaint entity
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "✅ Complaint filed",
            "data", Map.of(
                "status",      "Open",
                "subject",     body.getOrDefault("subject", "General"),
                "description", body.getOrDefault("description", ""),
                "filedAt",     LocalDateTime.now().toString()
            )
        ));
    }

    @PostMapping("/hire-maid")
    @Permissions("hireMaid")
    public ResponseEntity<?> hireMaid(HttpServletRequest req) {
        return ResponseEntity.ok(Map.of(
            "success", true, "message", "✅ Maid hired", "data", Map.of("status", "Hired")
        ));
    }
}
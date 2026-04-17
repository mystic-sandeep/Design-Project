package com.mygate.controller;

import com.mygate.dto.*;
import com.mygate.entity.Guest;
import com.mygate.service.GuestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
// ADD THESE IMPORTS:
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guests")
@CrossOrigin(origins = "*")
public class GuestController {
    
    @Autowired
    private GuestService guestService;
    
    @PostMapping("/approve")
    public ResponseEntity<GuestResponse> approveGuest(@Valid @RequestBody ApproveGuestRequest request) {
        GuestResponse response = guestService.approveGuest(request);
        return ResponseEntity.ok(response);
    }
    
@PostMapping("/verify")
public ResponseEntity<?> verifyGuest(@RequestBody VerifyRequest request) {
    try {
        Guest guest = guestService.verifyGuest(request.passCode);
        return ResponseEntity.ok(guest);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}
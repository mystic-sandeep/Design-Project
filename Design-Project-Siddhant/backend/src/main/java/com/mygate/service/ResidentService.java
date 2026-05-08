package com.mygate.service;

import com.mygate.entity.*;
import com.mygate.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Resident operations service
 */
@Slf4j
@Service
public class ResidentService {
    
    @Autowired
    private ResidentEnhancedRepository residentRepository;
    
    @Autowired
    private VisitorPassRepository visitorPassRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuditLogService auditLogService;
    
    /**
     * Get resident profile
     */
    public Map<String, Object> getResidentProfile(String residentId) {
        ResidentEnhanced resident = residentRepository.findById(residentId)
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        
        User user = resident.getUser();
        
        return Map.of(
                "id", resident.getId(),
                "fullName", resident.getFullName(),
                "email", user.getEmail(),
                "phone", user.getPhone(),
                "apartmentNumber", resident.getApartmentNumber(),
                "building", resident.getBuilding() != null ? resident.getBuilding() : "N/A",
                "vehicleNumber", resident.getVehicleNumber() != null ? resident.getVehicleNumber() : "N/A",
                "moveInDate", resident.getMoveInDate().toString(),
                "emergencyContact", resident.getEmergencyContactName() != null ? 
                        Map.of("name", resident.getEmergencyContactName(), 
                               "phone", resident.getEmergencyContactPhone()) : null,
                "createdAt", resident.getCreatedAt().toString()
        );
    }
    
    /**
     * Update resident profile
     */
    @Transactional
    public void updateResidentProfile(String residentId, String emergencyContactName, 
                                     String emergencyContactPhone, String vehicleNumber, String ipAddress) {
        
        ResidentEnhanced resident = residentRepository.findById(residentId)
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        
        Map<String, Object> oldValues = Map.of(
                "emergencyContactName", resident.getEmergencyContactName() != null ? resident.getEmergencyContactName() : "N/A",
                "vehicleNumber", resident.getVehicleNumber() != null ? resident.getVehicleNumber() : "N/A"
        );
        
        resident.setEmergencyContactName(emergencyContactName);
        resident.setEmergencyContactPhone(emergencyContactPhone);
        resident.setVehicleNumber(vehicleNumber);
        
        residentRepository.save(resident);
        
        Map<String, Object> newValues = Map.of(
                "emergencyContactName", emergencyContactName,
                "vehicleNumber", vehicleNumber
        );
        
        auditLogService.logAction(residentId, "PROFILE_UPDATED", "RESIDENT", residentId,
                oldValues, newValues, ipAddress, "SUCCESS", null);
        
        log.info("Resident profile updated: {}", residentId);
    }
    
    /**
     * Request visitor pass
     */
    @Transactional
    public VisitorPass requestVisitorPass(String residentId, String visitorName, String visitorContact,
                                         LocalDate visitDate, String purpose) {
        
        ResidentEnhanced resident = residentRepository.findById(residentId)
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        
        VisitorPass pass = VisitorPass.builder()
                .id(UUID.randomUUID().toString())
                .resident(resident)
                .visitorName(visitorName)
                .visitorContact(visitorContact)
                .visitDate(visitDate)
                .purpose(purpose)
                .status(VisitorPass.Status.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        
        visitorPassRepository.save(pass);
        
        auditLogService.logAction(residentId, "VISITOR_PASS_REQUESTED", "VISITOR_PASS", pass.getId(),
                null, Map.of("visitorName", visitorName, "visitDate", visitDate.toString()),
                "N/A", "SUCCESS", null);
        
        log.info("Visitor pass requested by resident {}: {}", residentId, visitorName);
        return pass;
    }
    
    /**
     * Get visitor pass history
     */
    public List<Map<String, Object>> getVisitorPassHistory(String residentId) {
        List<VisitorPass> passes = visitorPassRepository.findByResidentIdOrderByCreatedAtDesc(residentId);
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (VisitorPass pass : passes) {
            result.add(Map.of(
                    "id", pass.getId(),
                    "visitorName", pass.getVisitorName(),
                    "visitorContact", pass.getVisitorContact() != null ? pass.getVisitorContact() : "N/A",
                    "visitDate", pass.getVisitDate().toString(),
                    "purpose", pass.getPurpose() != null ? pass.getPurpose() : "N/A",
                    "status", pass.getStatus().toString(),
                    "createdAt", pass.getCreatedAt().toString(),
                    "approvedAt", pass.getApprovedAt() != null ? pass.getApprovedAt().toString() : null
            ));
        }
        
        return result;
    }
    
    /**
     * Approve visitor pass (admin/guard only)
     */
    @Transactional
    public void approveVisitorPass(String passId, String approvedByUserId) {
        VisitorPass pass = visitorPassRepository.findById(passId)
                .orElseThrow(() -> new RuntimeException("Visitor pass not found"));
        
        pass.setStatus(VisitorPass.Status.APPROVED);
        pass.setApprovedAt(LocalDateTime.now());
        visitorPassRepository.save(pass);
        
        auditLogService.logAction(approvedByUserId, "VISITOR_PASS_APPROVED", "VISITOR_PASS", passId,
                Map.of("status", "PENDING"), Map.of("status", "APPROVED"),
                "N/A", "SUCCESS", null);
        
        log.info("Visitor pass approved: {}", passId);
    }
    
    /**
     * Reject visitor pass
     */
    @Transactional
    public void rejectVisitorPass(String passId, String rejectedByUserId) {
        VisitorPass pass = visitorPassRepository.findById(passId)
                .orElseThrow(() -> new RuntimeException("Visitor pass not found"));
        
        pass.setStatus(VisitorPass.Status.REJECTED);
        visitorPassRepository.save(pass);
        
        auditLogService.logAction(rejectedByUserId, "VISITOR_PASS_REJECTED", "VISITOR_PASS", passId,
                Map.of("status", "PENDING"), Map.of("status", "REJECTED"),
                "N/A", "SUCCESS", null);
        
        log.info("Visitor pass rejected: {}", passId);
    }
}
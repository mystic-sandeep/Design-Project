package com.mygate.service;

import com.mygate.entity.*;
import com.mygate.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Guard operations service
 */
@Slf4j
@Service
public class GuardService {
    
    @Autowired
    private GuardRepository guardRepository;
    
    @Autowired
    private EntryExitLogRepository entryExitLogRepository;
    
    @Autowired
    private IncidentRepository incidentRepository;
    
    @Autowired
    private AuditLogService auditLogService;
    
    /**
     * Record visitor entry
     */
    @Transactional
    public EntryExitLog recordVisitorEntry(String guardId, String visitorName, String vehicleNumber,
                                           String apartmentNumber, String purpose, String contactNumber) {
        
        if (contactNumber == null || !contactNumber.matches("\\d{10}")) {
            throw new IllegalArgumentException("Contact number must be exactly 10 numerical digits");
        }

        Guard guard = guardRepository.findById(guardId)
                .orElseThrow(() -> new RuntimeException("Guard not found"));
        
        EntryExitLog entryLog = EntryExitLog.builder()
                .id(UUID.randomUUID().toString())
                .guard(guard)
                .visitorName(visitorName)
                .vehicleNumber(vehicleNumber)
                .apartmentNumber(apartmentNumber)
                .purpose(purpose)
                .contactNumber(contactNumber)
                .entryTime(LocalDateTime.now())
                .status("ENTRY")
                .build();
        
        entryExitLogRepository.save(entryLog);
        
        auditLogService.logAction(guardId, "VISITOR_ENTRY_RECORDED", "ENTRY_EXIT", entryLog.getId(),
                null, Map.of("visitorName", visitorName, "apartmentNumber", apartmentNumber), 
                "N/A", "SUCCESS", null);
        
        log.info("Visitor entry recorded: {} for guard {}", visitorName, guardId);
        return entryLog;
    }
    
    /**
     * Record visitor exit
     */
    @Transactional
    public EntryExitLog recordVisitorExit(String entryLogId, String guardId) {
        
        EntryExitLog entryLog = entryExitLogRepository.findById(entryLogId)
                .orElseThrow(() -> new RuntimeException("Entry log not found"));
        
        entryLog.setExitTime(LocalDateTime.now());
        entryLog.setStatus("EXIT");
        entryExitLogRepository.save(entryLog);
        
        auditLogService.logAction(guardId, "VISITOR_EXIT_RECORDED", "ENTRY_EXIT", entryLogId,
                Map.of("status", "ENTRY"), Map.of("status", "EXIT"), 
                "N/A", "SUCCESS", null);
        
        log.info("Visitor exit recorded for entry log: {}", entryLogId);
        return entryLog;
    }
    
    /**
     * Report incident
     */
    @Transactional
    public Incident reportIncident(String guardId, String title, String description,
                                   Incident.Severity severity, String location) {
        
        Guard guard = guardRepository.findById(guardId)
                .orElseThrow(() -> new RuntimeException("Guard not found"));
        
        Incident incident = Incident.builder()
                .id(UUID.randomUUID().toString())
                .guard(guard)
                .title(title)
                .description(description)
                .severity(severity)
                .location(location)
                .status(Incident.Status.OPEN)
                .reportedAt(LocalDateTime.now())
                .build();
        
        incidentRepository.save(incident);
        
        auditLogService.logAction(guardId, "INCIDENT_REPORTED", "INCIDENT", incident.getId(),
                null, Map.of("title", title, "severity", severity.toString(), "location", location),
                "N/A", "SUCCESS", null);
        
        log.info("Incident reported by guard {}: {}", guardId, title);
        return incident;
    }
    
    /**
     * Get entry/exit logs for a guard
     */
    public List<Map<String, Object>> getEntryExitLogs(String guardId, int limit) {
        List<EntryExitLog> logs = entryExitLogRepository.findByGuardIdOrderByEntryTimeDesc(guardId);
        
        List<Map<String, Object>> result = new ArrayList<>();
        int count = 0;
        
        for (EntryExitLog logItem : logs) {
            if (count++ >= limit) break;
            
            result.add(Map.of(
                    "id", logItem.getId(),
                    "visitorName", logItem.getVisitorName(),
                    "apartmentNumber", logItem.getApartmentNumber() != null ? logItem.getApartmentNumber() : "N/A",
                    "vehicleNumber", logItem.getVehicleNumber() != null ? logItem.getVehicleNumber() : "N/A",
                    "purpose", logItem.getPurpose() != null ? logItem.getPurpose() : "N/A",
                    "entryTime", logItem.getEntryTime().toString(),
                    "exitTime", logItem.getExitTime() != null ? logItem.getExitTime().toString() : "Still inside",
                    "status", logItem.getStatus()
            ));
        }
        
        return result;
    }
    
    /**
     * Get incidents reported by guard
     */
    public List<Map<String, Object>> getIncidentsReportedByGuard(String guardId) {
        List<Incident> incidents = incidentRepository.findByGuardIdOrderByReportedAtDesc(guardId);
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Incident incident : incidents) {
            result.add(Map.of(
                    "id", incident.getId(),
                    "title", incident.getTitle(),
                    "description", incident.getDescription(),
                    "severity", incident.getSeverity().toString(),
                    "location", incident.getLocation() != null ? incident.getLocation() : "N/A",
                    "status", incident.getStatus().toString(),
                    "reportedAt", incident.getReportedAt().toString()
            ));
        }
        
        return result;
    }
    
    /**
     * Resolve incident
     */
    @Transactional
    public void resolveIncident(String incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        
        incident.setStatus(Incident.Status.RESOLVED);
        incident.setResolvedAt(LocalDateTime.now());
        incidentRepository.save(incident);
        
        log.info("Incident resolved: {}", incidentId);
    }
}
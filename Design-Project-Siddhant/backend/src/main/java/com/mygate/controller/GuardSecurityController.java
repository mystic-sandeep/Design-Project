package com.mygate.controller;

import com.mygate.dto.EntryExitLogDTO;
import com.mygate.dto.IncidentReportDTO;
import com.mygate.entity.Incident;
import com.mygate.security.Permissions;
import com.mygate.service.GuardService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/guard/security")
@CrossOrigin(origins = "*")
public class GuardSecurityController {
    
    @Autowired
    private GuardService guardService;
    
    /**
     * Record visitor entry
     */
    @PostMapping("/entry")
    @Permissions("record_entry_exit")
    public ResponseEntity<Map<String, Object>> recordEntry(
            @Valid @RequestBody EntryExitLogDTO request,
            HttpServletRequest httpRequest) {
        try {
            String guardId = (String) httpRequest.getAttribute("userId");
            
            var log = guardService.recordVisitorEntry(
                    guardId,
                    request.getVisitorName(),
                    request.getVehicleNumber(),
                    request.getApartmentNumber(),
                    request.getPurpose(),
                    request.getContactNumber()
            );
            
            return ResponseEntity.status(201).body(Map.of(
                    "success", true,
                    "message", "Entry recorded successfully",
                    "data", Map.of(
                            "logId", log.getId(),
                            "visitorName", log.getVisitorName(),
                            "entryTime", log.getEntryTime().toString()
                    )
            ));
        } catch (Exception e) {
            log.error("Failed to record entry: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Record visitor exit
     */
    @PostMapping("/exit/{entryLogId}")
    @Permissions("record_entry_exit")
    public ResponseEntity<Map<String, Object>> recordExit(
            @PathVariable String entryLogId,
            HttpServletRequest httpRequest) {
        try {
            String guardId = (String) httpRequest.getAttribute("userId");
            
            var log = guardService.recordVisitorExit(entryLogId, guardId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Exit recorded successfully",
                    "data", Map.of(
                            "logId", log.getId(),
                            "exitTime", log.getExitTime().toString()
                    )
            ));
        } catch (Exception e) {
            log.error("Failed to record exit: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Report incident
     */
    @PostMapping("/incidents")
    @Permissions("report_incident")
    public ResponseEntity<Map<String, Object>> reportIncident(
            @Valid @RequestBody IncidentReportDTO request,
            HttpServletRequest httpRequest) {
        try {
            String guardId = (String) httpRequest.getAttribute("userId");
            
            Incident.Severity severity = Incident.Severity.valueOf(request.getSeverity());
            
            var incident = guardService.reportIncident(
                    guardId,
                    request.getTitle(),
                    request.getDescription(),
                    severity,
                    request.getLocation()
            );
            
            return ResponseEntity.status(201).body(Map.of(
                    "success", true,
                    "message", "Incident reported successfully",
                    "data", Map.of(
                            "incidentId", incident.getId(),
                            "title", incident.getTitle(),
                            "severity", incident.getSeverity().toString(),
                            "status", incident.getStatus().toString()
                    )
            ));
        } catch (Exception e) {
            log.error("Failed to report incident: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Get entry/exit logs
     */
    @GetMapping("/logs")
    @Permissions("record_entry_exit")
    public ResponseEntity<Map<String, Object>> getEntryExitLogs(
            @RequestParam(defaultValue = "50") int limit,
            HttpServletRequest httpRequest) {
        try {
            String guardId = (String) httpRequest.getAttribute("userId");
            
            List<Map<String, Object>> logs = guardService.getEntryExitLogs(guardId, limit);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Logs retrieved",
                    "data", Map.of("logs", logs, "total", logs.size())
            ));
        } catch (Exception e) {
            log.error("Failed to get logs: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Get incidents
     */
    @GetMapping("/incidents")
    @Permissions("report_incident")
    public ResponseEntity<Map<String, Object>> getIncidents(
            HttpServletRequest httpRequest) {
        try {
            String guardId = (String) httpRequest.getAttribute("userId");
            
            List<Map<String, Object>> incidents = guardService.getIncidentsReportedByGuard(guardId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Incidents retrieved",
                    "data", Map.of("incidents", incidents, "total", incidents.size())
            ));
        } catch (Exception e) {
            log.error("Failed to get incidents: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}
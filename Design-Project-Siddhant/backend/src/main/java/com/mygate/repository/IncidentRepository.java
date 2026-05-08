package com.mygate.repository;

import com.mygate.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, String> {
    List<Incident> findByGuardIdOrderByReportedAtDesc(String guardId);
    List<Incident> findByStatusOrderByReportedAtDesc(Incident.Status status);
    List<Incident> findBySeverityOrderByReportedAtDesc(Incident.Severity severity);
    List<Incident> findByReportedAtBetweenOrderByReportedAtDesc(LocalDateTime start, LocalDateTime end);
}
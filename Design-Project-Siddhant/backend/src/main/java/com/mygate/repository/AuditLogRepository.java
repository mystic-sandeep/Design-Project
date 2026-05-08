package com.mygate.repository;

import com.mygate.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserIdOrderByCreatedAtDesc(String userId);
    List<AuditLog> findByActionOrderByCreatedAtDesc(String action);
    List<AuditLog> findByResourceTypeAndResourceId(String resourceType, String resourceId);
    List<AuditLog> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
}
package com.mygate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_action", columnList = "action"),
    @Index(name = "idx_resource", columnList = "resource_type,resource_id"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false)
    private String action;
    
    private String resourceType;
    
    private String resourceId;
    
    @Column(columnDefinition = "JSON")
    private String oldValues;
    
    @Column(columnDefinition = "JSON")
    private String newValues;
    
    private String ipAddress;
    
    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'SUCCESS'")
    private String status = "SUCCESS";
    
    @Column(columnDefinition = "TEXT")
    private String errorMessage;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

package com.mygate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_severity", columnList = "severity"),
    @Index(name = "idx_reported_at", columnList = "reported_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {
    
    @Id
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "guard_id")
    private Guard guard;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    private Severity severity;
    
    private String location;
    
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'OPEN'")
    private Status status = Status.OPEN;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime reportedAt = LocalDateTime.now();
    
    private LocalDateTime resolvedAt;
    
    public enum Severity {
        LOW, MEDIUM, HIGH, CRITICAL
    }
    
    public enum Status {
        OPEN, IN_PROGRESS, RESOLVED, CLOSED
    }
}

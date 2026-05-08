package com.mygate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_passes", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_visit_date", columnList = "visit_date"),
    @Index(name = "idx_resident_id", columnList = "resident_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorPass {
    
    @Id
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "resident_id")
    private ResidentEnhanced resident;
    
    @Column(nullable = false)
    private String visitorName;
    
    private String visitorContact;
    
    @Column(nullable = false)
    private LocalDate visitDate;
    
    private String purpose;
    
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'PENDING'")
    private Status status = Status.PENDING;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime approvedAt;
    
    public enum Status {
        PENDING, APPROVED, REJECTED, EXPIRED
    }
}

package com.mygate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "guards", indexes = {
    @Index(name = "idx_employee_id", columnList = "employee_id"),
    @Index(name = "idx_badge_number", columnList = "badge_number"),
    @Index(name = "idx_shift", columnList = "shift")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Guard {
    
    @Id
    private String id;
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(unique = true, nullable = false)
    private String employeeId;
    
    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'GENERAL'")
    private String shift = "GENERAL";
    
    private String assignedGate;
    
    @Column(unique = true)
    private String badgeNumber;
    
    private String emergencyContactName;
    
    private String emergencyContactPhone;
    
    @Lob
    private byte[] identificationDocument;
    
    private String documentHash;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

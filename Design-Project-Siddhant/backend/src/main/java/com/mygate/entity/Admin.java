package com.mygate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admins", indexes = {
    @Index(name = "idx_employee_id", columnList = "employee_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {
    
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
    
    private String department;
    
    @Column(columnDefinition = "JSON")
    private String permissionsOverride;
    
    private String createdBy;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

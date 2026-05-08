package com.mygate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "residents_enhanced", indexes = {
    @Index(name = "idx_apartment_number", columnList = "apartment_number"),
    @Index(name = "idx_building", columnList = "building"),
    @Index(name = "idx_vehicle_number", columnList = "vehicle_number")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResidentEnhanced {
    
    @Id
    private String id;
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String apartmentNumber;
    
    private String building;
    
    private String emergencyContactName;
    
    private String emergencyContactPhone;
    
    private String vehicleNumber;
    
    @Lob
    private byte[] identificationProof;
    
    private String proofHash;
    
    private LocalDate moveInDate;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
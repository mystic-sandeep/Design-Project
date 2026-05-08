package com.mygate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "entry_exit_logs", indexes = {
    @Index(name = "idx_entry_time", columnList = "entry_time"),
    @Index(name = "idx_exit_time", columnList = "exit_time"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_apartment_number", columnList = "apartment_number")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntryExitLog {
    
    @Id
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "guard_id")
    private Guard guard;
    
    @Column(nullable = false)
    private String visitorName;
    
    private String vehicleNumber;
    
    private String apartmentNumber;
    
    private String purpose;
    
    private String contactNumber;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime entryTime = LocalDateTime.now();
    
    private LocalDateTime exitTime;
    
    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'ENTRY'")
    private String status = "ENTRY";
}

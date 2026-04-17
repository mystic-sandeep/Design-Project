package com.mygate.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "guests")
@Data
public class Guest {
    @Id
    private String id;
    
    private String passCode;
    private String residentId;
    private String residentName;
    private String name;
    private String phone;
    private String purpose;
    
    @Enumerated(EnumType.STRING)
    private GuestStatus status = GuestStatus.APPROVED;
    
    private LocalDateTime approvedAt;
    private LocalDateTime checkedInAt;
}

enum GuestStatus {
    APPROVED, CHECKED_IN, EXPIRED
}
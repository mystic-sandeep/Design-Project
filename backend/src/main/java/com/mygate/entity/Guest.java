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
    
    // Getters
    public String getId() { return id; }
    public String getPassCode() { return passCode; }
    public String getResidentId() { return residentId; }
    public String getResidentName() { return residentName; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getPurpose() { return purpose; }
    public GuestStatus getStatus() { return status; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public LocalDateTime getCheckedInAt() { return checkedInAt; }
    
    // Setters
    public void setId(String id) { this.id = id; }
    public void setPassCode(String passCode) { this.passCode = passCode; }
    public void setResidentId(String residentId) { this.residentId = residentId; }
    public void setResidentName(String residentName) { this.residentName = residentName; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public void setStatus(GuestStatus status) { this.status = status; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public void setCheckedInAt(LocalDateTime checkedInAt) { this.checkedInAt = checkedInAt; }
}

enum GuestStatus {
    APPROVED, CHECKED_IN, EXPIRED
}
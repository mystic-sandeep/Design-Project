package com.mygate.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "residents")
@Data
public class Resident {
    @Id
    private String id;
    
    private String name;
    private String phone;
    private String flatNumber;
    
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getFlatNumber() { return flatNumber; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setFlatNumber(String flatNumber) { this.flatNumber = flatNumber; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
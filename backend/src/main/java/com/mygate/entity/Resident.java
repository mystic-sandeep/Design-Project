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
}
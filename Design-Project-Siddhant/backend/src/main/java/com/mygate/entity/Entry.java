package com.mygate.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "entries")
@Data
public class Entry {
    @Id
    private String id;
    
    private String guestId;
    private String passCode;
    private String guestName;
    private String residentId;
    private String purpose;
    private LocalDateTime entryTime;
}
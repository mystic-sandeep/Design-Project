package com.mygate.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_members")
public class StaffMember {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String type; // maid | cook | driver | gardener
    private String phone;
    @Column(name = "resident_id") private Long residentId;
    @Column(name = "entry_time") private LocalDateTime entryTime;
    @Column(name = "exit_time") private LocalDateTime exitTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Long getResidentId() { return residentId; }
    public void setResidentId(Long id) { this.residentId = id; }
    public LocalDateTime getEntryTime() { return entryTime; }
    public void setEntryTime(LocalDateTime t) { this.entryTime = t; }
    public LocalDateTime getExitTime() { return exitTime; }
    public void setExitTime(LocalDateTime t) { this.exitTime = t; }
}
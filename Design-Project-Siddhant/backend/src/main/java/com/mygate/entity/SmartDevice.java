package com.mygate.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "smart_devices")
public class SmartDevice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String type; // lock | barrier | bell
    private String status = "closed";
    private String location;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStatus() { return status; }
    public void setStatus(String s) { this.status = s; }
    public String getLocation() { return location; }
    public void setLocation(String l) { this.location = l; }
}
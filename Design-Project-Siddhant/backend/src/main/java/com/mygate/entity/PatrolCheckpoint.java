package com.mygate.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "patrol_checkpoints")
public class PatrolCheckpoint {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    private String location;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String loc) { this.location = loc; }
}
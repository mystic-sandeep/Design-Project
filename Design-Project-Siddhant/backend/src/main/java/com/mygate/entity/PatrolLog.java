package com.mygate.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patrol_logs")
public class PatrolLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "guard_id") private String guardId;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "checkpoint_id") private PatrolCheckpoint checkpoint;
    @Column(name = "gps_location") private String gpsLocation;
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() { if (timestamp == null) timestamp = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getGuardId() { return guardId; }
    public void setGuardId(String g) { this.guardId = g; }
    public PatrolCheckpoint getCheckpoint() { return checkpoint; }
    public void setCheckpoint(PatrolCheckpoint c) { this.checkpoint = c; }
    public String getGpsLocation() { return gpsLocation; }
    public void setGpsLocation(String gps) { this.gpsLocation = gps; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime t) { this.timestamp = t; }
}
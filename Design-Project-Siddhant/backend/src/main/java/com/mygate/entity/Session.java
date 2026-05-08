package com.mygate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_expires_at", columnList = "expires_at"),
    @Index(name = "idx_revoked_at", columnList = "revoked_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {
    
    @Id
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(unique = true)
    private String tokenJti;
    
    private String ipAddress;
    
    @Column(columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime revokedAt;
}

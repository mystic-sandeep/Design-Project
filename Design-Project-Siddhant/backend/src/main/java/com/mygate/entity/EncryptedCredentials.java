package com.mygate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "encrypted_credentials", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncryptedCredentials {
    
    @Id
    private String id;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;
    
    @Column(name = "aadhar_number")
    private String aadharNumber;
    
    @Column(name = "pan_number")
    private String panNumber;
    
    private String backupEmail;
    
    private String backupPhone;
    
    private Integer encryptionKeyVersion = 1;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}

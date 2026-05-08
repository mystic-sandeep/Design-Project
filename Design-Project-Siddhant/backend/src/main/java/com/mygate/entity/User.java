package com.mygate.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_phone", columnList = "phone"),
    @Index(name = "idx_role", columnList = "role"),
    @Index(name = "idx_is_active", columnList = "is_active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    private String id;
    
    @Email(message = "Invalid email format")
    @Column(unique = true, nullable = false)
    @NotBlank(message = "Email cannot be blank")
    private String email;
    
    @Column(unique = true, nullable = false)
    @NotBlank(message = "Phone cannot be blank")
    private String phone;
    
    @Column(nullable = false)
    @NotBlank(message = "Password hash cannot be blank")
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean isActive = true;
    
    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isVerified = false;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    private LocalDateTime lastLogin;

    public enum Role {
        ADMIN, GUARD, RESIDENT, STAFF
    }
}

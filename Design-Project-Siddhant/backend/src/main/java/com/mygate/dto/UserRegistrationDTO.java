package com.mygate.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegistrationDTO {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[+]?[0-9]{10,13}$", message = "Phone must be valid")
    private String phone;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "ADMIN|GUARD|RESIDENT|STAFF", message = "Role must be ADMIN, GUARD, RESIDENT, or STAFF")
    private String role;
    
    // Role-specific fields
    private String employeeId;      // For ADMIN, GUARD
    private String department;       // For ADMIN
    private String shift;            // For GUARD
    private String assignedGate;     // For GUARD
    private String badgeNumber;      // For GUARD
    private String apartmentNumber;  // For RESIDENT
    private String building;         // For RESIDENT
    private String vehicleNumber;    // For RESIDENT
}
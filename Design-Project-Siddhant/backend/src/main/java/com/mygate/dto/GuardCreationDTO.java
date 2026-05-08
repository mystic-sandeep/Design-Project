package com.mygate.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuardCreationDTO {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Phone is required")
    private String phone;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Employee ID is required")
    private String employeeId;
    
    private String shift;           // GENERAL, MORNING, EVENING, NIGHT
    private String assignedGate;
    private String badgeNumber;
    
    private String emergencyContactName;
    private String emergencyContactPhone;
}
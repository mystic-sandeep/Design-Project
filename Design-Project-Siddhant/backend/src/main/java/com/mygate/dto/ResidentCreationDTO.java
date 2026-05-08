package com.mygate.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResidentCreationDTO {
    
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
    
    @NotBlank(message = "Apartment number is required")
    private String apartmentNumber;
    
    private String building;
    
    private LocalDate moveInDate;
    
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String vehicleNumber;
}
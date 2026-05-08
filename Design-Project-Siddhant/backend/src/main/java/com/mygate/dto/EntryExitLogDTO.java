package com.mygate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntryExitLogDTO {
    
    @NotBlank(message = "Visitor name is required")
    private String visitorName;
    
    private String vehicleNumber;
    
    @NotBlank(message = "Apartment number is required")
    private String apartmentNumber;
    
    private String purpose;
    
    private String contactNumber;
}
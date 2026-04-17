package com.mygate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApproveGuestRequest {
    @NotBlank
    private String residentId;
    
    @NotBlank
    private String name;
    
    @NotBlank
    private String phone;
    
    private String purpose;
}
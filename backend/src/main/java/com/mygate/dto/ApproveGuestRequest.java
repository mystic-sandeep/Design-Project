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
    
    // Getters
    public String getResidentId() { return residentId; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getPurpose() { return purpose; }
    
    // Setters
    public void setResidentId(String residentId) { this.residentId = residentId; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
}
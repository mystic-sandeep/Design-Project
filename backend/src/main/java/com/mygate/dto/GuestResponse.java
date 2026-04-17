package com.mygate.dto;

import lombok.Data;

@Data
public class GuestResponse {
    private boolean success;
    private String guestId;
    private String passCode;
    private String qrDataUrl;
    private String message;
    
    // Getters
    public boolean isSuccess() { return success; }
    public String getGuestId() { return guestId; }
    public String getPassCode() { return passCode; }
    public String getQrDataUrl() { return qrDataUrl; }
    public String getMessage() { return message; }
    
    // Setters
    public void setSuccess(boolean success) { this.success = success; }
    public void setGuestId(String guestId) { this.guestId = guestId; }
    public void setPassCode(String passCode) { this.passCode = passCode; }
    public void setQrDataUrl(String qrDataUrl) { this.qrDataUrl = qrDataUrl; }
    public void setMessage(String message) { this.message = message; }
}
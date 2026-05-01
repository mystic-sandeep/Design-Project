package com.mygate.dto;

import lombok.Data;

@Data
public class VerifyRequest {
    private String passCode;
    
    public String getPassCode() {
        return passCode;
    }
    
    public void setPassCode(String passCode) {
        this.passCode = passCode;
    }
}
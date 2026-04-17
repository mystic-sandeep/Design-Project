package com.mygate.dto;

import lombok.Data;

@Data
public class GuestResponse {
    private boolean success;
    private String guestId;
    private String passCode;
    private String qrDataUrl;
    private String message;
}
package com.mygate.dto;

import lombok.*;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    
    private boolean success;
    private String message;
    private String token;
    private UserInfoDTO user;
    private long timestamp;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserInfoDTO {
        private String id;
        private String email;
        private String phone;
        private String role;
        private boolean isActive;
        private boolean isVerified;
        private String fullName;
        private Map<String, Object> additionalInfo;
    }
}
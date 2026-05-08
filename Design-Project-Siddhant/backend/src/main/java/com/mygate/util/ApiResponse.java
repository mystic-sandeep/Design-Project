package com.mygate.util;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse {
    
    private boolean success;
    private String message;
    private Map<String, Object> data;
    private String error;
    private String errorCode;
    private LocalDateTime timestamp;
    private String path;
    
    public static ApiResponse success(String message, Map<String, Object> data) {
        return ApiResponse.builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static ApiResponse error(String message, String errorCode) {
        return ApiResponse.builder()
                .success(false)
                .error(message)
                .errorCode(errorCode)
                .timestamp(LocalDateTime.now())
                .build();
    }
}

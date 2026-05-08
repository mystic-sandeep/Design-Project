package com.mygate.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogDTO {
    
    private Long id;
    private String userId;
    private String userEmail;
    private String action;
    private String resourceType;
    private String resourceId;
    private String oldValues;
    private String newValues;
    private String ipAddress;
    private String status;
    private String errorMessage;
    private LocalDateTime createdAt;
}
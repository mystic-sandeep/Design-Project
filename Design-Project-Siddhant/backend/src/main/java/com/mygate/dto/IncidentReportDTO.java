package com.mygate.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentReportDTO {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;
    
    @NotBlank(message = "Severity is required")
    @Pattern(regexp = "LOW|MEDIUM|HIGH|CRITICAL", message = "Severity must be LOW, MEDIUM, HIGH, or CRITICAL")
    private String severity;
    
    private String location;
}
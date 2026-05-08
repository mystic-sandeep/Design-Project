package com.mygate.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorPassRequestDTO {
    
    @NotBlank(message = "Visitor name is required")
    private String visitorName;
    
    @NotBlank(message = "Visitor contact is required")
    private String visitorContact;
    
    @NotNull(message = "Visit date is required")
    @FutureOrPresent(message = "Visit date must be today or in future")
    private LocalDate visitDate;
    
    private String purpose;
}
package com.mygate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;

// Disable default Spring Security for both the main app and Actuator
@SpringBootApplication(exclude = { 
    SecurityAutoConfiguration.class, 
    ManagementWebSecurityAutoConfiguration.class 
})
public class MygateApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(MygateApplication.class, args);
        System.out.println("\n🚀 Mygate Backend Started!");
        System.out.println("📱 API: http://localhost:8080");
        System.out.println("📊 H2 Console: http://localhost:8080/h2-console");
        System.out.println("🔗 Swagger: http://localhost:8080/swagger-ui.html\n");
    }
}
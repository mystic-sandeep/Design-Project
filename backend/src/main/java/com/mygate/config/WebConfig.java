package com.mygate.config;

import com.mygate.security.RbacInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration for RBAC interceptor
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Autowired
    private RbacInterceptor rbacInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Apply RBAC interceptor to all v2 endpoints
        registry.addInterceptor(rbacInterceptor)
                .addPathPatterns("/api/v2/**");
    }
}
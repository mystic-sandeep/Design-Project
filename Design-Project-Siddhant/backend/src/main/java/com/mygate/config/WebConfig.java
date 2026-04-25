package com.mygate.config;

import com.mygate.security.RbacInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

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

    // ✅ CORS CONFIG (VERY IMPORTANT)
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://127.0.0.1:5500", "http://localhost:5500")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
package com.mygate.security;

import com.mygate.enums.Role;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import java.util.Arrays;

/**
 * RBAC Interceptor - Validates role-based permissions
 */
@Component
public class RbacInterceptor implements HandlerInterceptor {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        // Check if handler has @Permissions annotation
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Permissions permissions = handlerMethod.getMethodAnnotation(Permissions.class);
        
        // If no @Permissions annotation, allow access (public endpoint)
        if (permissions == null) {
            return true;
        }
        
        String[] requiredPermissions = permissions.value();
        if (requiredPermissions.length == 0) {
            return true;
        }
        
        // Extract and validate JWT token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return sendError(response, 401, "Unauthorized - Token missing");
        }
        
        String token = authHeader.substring(7);
        
        if (!jwtUtil.validateToken(token)) {
            return sendError(response, 401, "Unauthorized - Invalid token");
        }
        
        // Get role from token
        String roleStr = jwtUtil.getRoleFromToken(token);
        Role userRole = Role.fromString(roleStr);
        
        // Check if user has required permissions
        boolean hasPermission = false;
        for (String requiredPerm : requiredPermissions) {
            if (userRole.hasPermission(requiredPerm)) {
                hasPermission = true;
                break;
            }
        }
        
        if (!hasPermission) {
            return sendError(response, 403, 
                "Forbidden - You don't have permission for this action. Required: " + Arrays.toString(requiredPermissions));
        }
        
        // Store user info in request attributes
        request.setAttribute("userId", jwtUtil.getUserIdFromToken(token));
        request.setAttribute("userRole", userRole);
        request.setAttribute("userEmail", jwtUtil.getEmailFromToken(token));
        
        return true;
    }
    
    private boolean sendError(HttpServletResponse response, int status, String message) throws Exception {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"success\": false, \"error\": \"" + message + "\"}");
        return false;
    }
}
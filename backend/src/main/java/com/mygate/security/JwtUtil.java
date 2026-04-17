package com.mygate.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

@Component
public class JwtUtil {
    
    // IMPORTANT: This secret key MUST be at least 64 characters (512 bits) for HS512
    private static final String SECRET = "mygate_2026_secure_key_layer1_jwt_authentication_system_very_long_string_to_make_it_secure_enough_for_hs512_algorithm";
    private static final long EXPIRATION_TIME = 86400000; // 24 hours
    private static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    
    /**
     * Generate JWT Token with userId, email, and role
     */
    public String generateToken(String userId, String email, String role) {
        return Jwts.builder()
                .setSubject(userId)
                .claim("email", email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(KEY, SignatureAlgorithm.HS512)
                .compact();
    }
    
    /**
     * Validate JWT Token
     * Returns: true if valid, false if invalid or expired
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * Extract all claims from token
     */
    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    /**
     * Get user ID (subject) from token
     */
    public String getUserIdFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }
    
    /**
     * Get role from token
     */
    public String getRoleFromToken(String token) {
        return getClaimsFromToken(token).get("role", String.class);
    }
    
    /**
     * Get email from token
     * NEW METHOD - Required for RBAC
     */
    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).get("email", String.class);
    }
    
    /**
     * Get token expiration time
     * Optional: Useful for checking token remaining validity
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimsFromToken(token).getExpiration();
    }
    
    /**
     * Check if token is expired
     * Optional: Useful for pre-validation before API calls
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}
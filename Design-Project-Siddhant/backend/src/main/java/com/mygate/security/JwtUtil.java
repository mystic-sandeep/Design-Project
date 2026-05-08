package com.mygate.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

@Component
public class JwtUtil {
    
    private static final String SECRET = "mygate_2026_secure_key_layer1_jwt_authentication_system_very_long_string_to_make_it_secure_enough_for_hs512_algorithm";
    private static final long EXPIRATION_TIME = 86400000;
    private static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    
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
    
  public boolean validateToken(String token) {
    try {
        Jwts.parser() // Changed from parserBuilder()
                .verifyWith(KEY) // Changed from setSigningKey()
                .build()
                .parseSignedClaims(token); // Changed from parseClaimsJws()
        return true;
    } catch (JwtException | IllegalArgumentException e) {
        return false;
    }
}

public Claims getClaimsFromToken(String token) {
    return Jwts.parser()
            .verifyWith(KEY)
            .build()
            .parseSignedClaims(token)
            .getPayload(); // .getBody() is also often replaced by .getPayload() in 0.12.x
}
    
    public String getUserIdFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }
    
    public String getRoleFromToken(String token) {
        return getClaimsFromToken(token).get("role", String.class);
    }
    
    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).get("email", String.class);
    }
    
    public Date getExpirationDateFromToken(String token) {
        return getClaimsFromToken(token).getExpiration();
    }
    
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}

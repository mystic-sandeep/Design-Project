package com.mygate.service;

import com.mygate.entity.Session;
import com.mygate.entity.User;
import com.mygate.repository.SessionRepository;
import com.mygate.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Slf4j
@Service
public class SessionService {
    
    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Session createSession(String userId, String tokenJti, String ipAddress, String userAgent, LocalDateTime expiresAt) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found: " + userId);
        }
        
        Session session = Session.builder()
                .id(UUID.randomUUID().toString())
                .user(userOpt.get())
                .tokenJti(tokenJti)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .expiresAt(expiresAt)
                .createdAt(LocalDateTime.now())
                .build();
        
        return sessionRepository.save(session);
    }
    
    public List<Session> getActiveSessionsForUser(String userId) {
        return sessionRepository.findByUserIdAndRevokedAtNull(userId);
    }
    
    public void revokeSession(String sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setRevokedAt(LocalDateTime.now());
            sessionRepository.save(session);
            log.info("Session revoked: {}", sessionId);
        }
    }
    
    public void revokeAllSessionsForUser(String userId) {
        List<Session> activeSessions = getActiveSessionsForUser(userId);
        for (Session session : activeSessions) {
            session.setRevokedAt(LocalDateTime.now());
            sessionRepository.save(session);
        }
        log.info("All sessions revoked for user: {}", userId);
    }
    
    public boolean isSessionValid(String sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return false;
        }
        
        Session session = sessionOpt.get();
        return session.getRevokedAt() == null && session.getExpiresAt().isAfter(LocalDateTime.now());
    }
    
    public void cleanupExpiredSessions() {
        LocalDateTime now = LocalDateTime.now();
        List<Session> expiredSessions = sessionRepository.findByUserIdAndExpiresAtBefore(null, now);
        for (Session session : expiredSessions) {
            if (session.getRevokedAt() == null) {
                session.setRevokedAt(now);
                sessionRepository.save(session);
            }
        }
        log.info("Cleaned up {} expired sessions", expiredSessions.size());
    }
    
    public Optional<Session> getSessionByTokenJti(String tokenJti) {
        return sessionRepository.findByTokenJti(tokenJti);
    }
}

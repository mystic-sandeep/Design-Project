package com.mygate.repository;

import com.mygate.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {
    Optional<Session> findByTokenJti(String tokenJti);
    List<Session> findByUserIdAndRevokedAtNull(String userId);
    List<Session> findByUserIdAndExpiresAtBefore(String userId, LocalDateTime dateTime);
}
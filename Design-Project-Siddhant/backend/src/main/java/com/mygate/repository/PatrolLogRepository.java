package com.mygate.repository;
import com.mygate.entity.PatrolLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PatrolLogRepository extends JpaRepository<PatrolLog, Long> {
    List<PatrolLog> findTop50ByOrderByTimestampDesc();
    long countByTimestampAfter(LocalDateTime time);
}
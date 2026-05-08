
package com.mygate.repository;

import com.mygate.entity.EntryExitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EntryExitLogRepository extends JpaRepository<EntryExitLog, String> {
    List<EntryExitLog> findByGuardIdOrderByEntryTimeDesc(String guardId);
    List<EntryExitLog> findByApartmentNumberOrderByEntryTimeDesc(String apartmentNumber);
    List<EntryExitLog> findByStatusOrderByEntryTimeDesc(String status);
    List<EntryExitLog> findByEntryTimeBetweenOrderByEntryTimeDesc(LocalDateTime start, LocalDateTime end);
}
package com.mygate.repository;

import com.mygate.entity.Guard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface GuardRepository extends JpaRepository<Guard, String> {
    Optional<Guard> findByEmployeeId(String employeeId);
    Optional<Guard> findByBadgeNumber(String badgeNumber);
    List<Guard> findByShift(String shift);
    List<Guard> findByAssignedGate(String gate);
    boolean existsByEmployeeId(String employeeId);
    boolean existsByBadgeNumber(String badgeNumber);
}
package com.mygate.repository;

import com.mygate.entity.VisitorPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface VisitorPassRepository extends JpaRepository<VisitorPass, String> {
    List<VisitorPass> findByResidentIdOrderByCreatedAtDesc(String residentId);
    List<VisitorPass> findByStatusOrderByCreatedAtDesc(VisitorPass.Status status);
    List<VisitorPass> findByVisitDateOrderByCreatedAtDesc(LocalDate visitDate);
}
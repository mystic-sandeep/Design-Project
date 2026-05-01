package com.mygate.repository;
import com.mygate.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    List<Visitor> findAllByOrderByIdDesc();
    long countByStatus(String status);
}
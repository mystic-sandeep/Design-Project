package com.mygate.repository;

import com.mygate.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByEmployeeId(String employeeId);
    boolean existsByEmployeeId(String employeeId);
}
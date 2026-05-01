package com.mygate.repository;
import com.mygate.entity.SmartDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SmartDeviceRepository extends JpaRepository<SmartDevice, Long> {
    long countByStatus(String status);
}
package com.mygate.repository;

import com.mygate.entity.ResidentEnhanced;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ResidentEnhancedRepository extends JpaRepository<ResidentEnhanced, String> {
    Optional<ResidentEnhanced> findByApartmentNumber(String apartmentNumber);
    List<ResidentEnhanced> findByBuilding(String building);
    List<ResidentEnhanced> findByVehicleNumber(String vehicleNumber);
}
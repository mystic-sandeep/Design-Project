package com.mygate.repository;

import com.mygate.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GuestRepository extends JpaRepository<Guest, String> {
    Optional<Guest> findByPassCode(String passCode);
    Optional<Guest> findByPhoneAndResidentId(String phone, String residentId);
}
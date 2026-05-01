package com.mygate.repository;
import com.mygate.entity.StaffMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<StaffMember, Long> {
    List<StaffMember> findAllByOrderByEntryTimeDesc();
    long countByEntryTimeAfter(LocalDateTime time);
}
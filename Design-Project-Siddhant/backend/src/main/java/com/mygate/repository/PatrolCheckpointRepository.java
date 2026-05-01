package com.mygate.repository;
import com.mygate.entity.PatrolCheckpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatrolCheckpointRepository extends JpaRepository<PatrolCheckpoint, Long> {}
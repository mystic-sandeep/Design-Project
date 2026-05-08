package com.mygate.repository;

import com.mygate.entity.EncryptedCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EncryptedCredentialsRepository extends JpaRepository<EncryptedCredentials, String> {
    Optional<EncryptedCredentials> findByUserId(String userId);
    boolean existsByUserId(String userId);
}
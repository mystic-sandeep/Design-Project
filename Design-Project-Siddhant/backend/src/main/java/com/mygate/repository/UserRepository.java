package com.mygate.repository;

import com.mygate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findByIdAndIsActiveTrue(String id);
    List<User> findByRole(User.Role role);
    List<User> findByRoleAndIsActiveTrue(User.Role role);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
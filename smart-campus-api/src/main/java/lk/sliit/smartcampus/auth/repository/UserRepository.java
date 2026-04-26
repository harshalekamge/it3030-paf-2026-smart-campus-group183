package lk.sliit.smartcampus.auth.repository;

import lk.sliit.smartcampus.auth.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    Optional<AppUser> findByGoogleId(String googleId);
    boolean existsByEmail(String email);
    boolean existsByGoogleId(String googleId);
}

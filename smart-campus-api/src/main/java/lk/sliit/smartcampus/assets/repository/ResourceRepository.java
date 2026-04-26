package lk.sliit.smartcampus.assets.repository;

import java.util.Optional;

import lk.sliit.smartcampus.assets.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Integer> {

    Optional<Resource> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, Integer id);
}

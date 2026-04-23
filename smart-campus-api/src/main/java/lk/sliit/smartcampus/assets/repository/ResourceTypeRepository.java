package lk.sliit.smartcampus.assets.repository;

import java.util.Optional;

import lk.sliit.smartcampus.assets.entity.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceTypeRepository extends JpaRepository<ResourceType, Integer> {

    Optional<ResourceType> findByTypeCodeIgnoreCase(String typeCode);

    boolean existsByTypeCodeIgnoreCase(String typeCode);

    boolean existsByTypeCodeIgnoreCaseAndIdNot(String typeCode, Integer id);
}

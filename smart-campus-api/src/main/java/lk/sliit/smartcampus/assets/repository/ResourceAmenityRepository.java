package lk.sliit.smartcampus.assets.repository;

import java.util.List;

import lk.sliit.smartcampus.assets.entity.ResourceAmenity;
import lk.sliit.smartcampus.assets.entity.ResourceAmenityId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceAmenityRepository extends JpaRepository<ResourceAmenity, ResourceAmenityId> {

    boolean existsByIdResourceIdAndIdAmenityId(Integer resourceId, Integer amenityId);

    List<ResourceAmenity> findAllByOrderByIdResourceIdAscIdAmenityIdAsc();
}

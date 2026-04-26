package lk.sliit.smartcampus.assets.repository;

import java.util.List;

import lk.sliit.smartcampus.assets.entity.ResourceMedia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceMediaRepository extends JpaRepository<ResourceMedia, Integer> {

    List<ResourceMedia> findAllByOrderByDisplayOrderAscIdAsc();
}

package lk.sliit.smartcampus.assets.repository;

import java.util.List;

import lk.sliit.smartcampus.assets.entity.AvailabilityWindow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvailabilityWindowRepository extends JpaRepository<AvailabilityWindow, Integer> {

    List<AvailabilityWindow> findAllByOrderByValidFromAscIdAsc();
}

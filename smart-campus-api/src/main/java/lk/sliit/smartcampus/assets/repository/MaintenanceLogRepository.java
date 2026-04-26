package lk.sliit.smartcampus.assets.repository;

import java.util.List;

import lk.sliit.smartcampus.assets.entity.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Integer> {

    List<MaintenanceLog> findAllByOrderByStartedAtDescIdDesc();
}

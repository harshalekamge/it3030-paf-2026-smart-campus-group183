package lk.sliit.smartcampus.assets;

import lk.sliit.smartcampus.assets.repository.MaintenanceLogRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import static org.junit.jupiter.api.Assertions.assertTrue;

class MaintenanceLogRepositoryTest {

    @Test
    void maintenanceLogRepositoryShouldExtendJpaRepository() {
        assertTrue(JpaRepository.class.isAssignableFrom(MaintenanceLogRepository.class));
    }
}

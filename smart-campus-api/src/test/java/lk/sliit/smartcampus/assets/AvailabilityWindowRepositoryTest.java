package lk.sliit.smartcampus.assets;

import lk.sliit.smartcampus.assets.repository.AvailabilityWindowRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import static org.junit.jupiter.api.Assertions.assertTrue;

class AvailabilityWindowRepositoryTest {

    @Test
    void availabilityWindowRepositoryShouldExtendJpaRepository() {
        assertTrue(JpaRepository.class.isAssignableFrom(AvailabilityWindowRepository.class));
    }
}

package lk.sliit.smartcampus.assets;

import lk.sliit.smartcampus.assets.repository.AmenityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import static org.junit.jupiter.api.Assertions.assertTrue;

class AmenityRepositoryTest {

    @Test
    void repositoryShouldExtendJpaRepository() {
        assertTrue(JpaRepository.class.isAssignableFrom(AmenityRepository.class));
    }
}

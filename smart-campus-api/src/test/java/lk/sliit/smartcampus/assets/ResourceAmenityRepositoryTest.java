package lk.sliit.smartcampus.assets;

import lk.sliit.smartcampus.assets.repository.ResourceAmenityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ResourceAmenityRepositoryTest {

    @Test
    void resourceAmenityRepositoryShouldExtendJpaRepository() {
        assertTrue(JpaRepository.class.isAssignableFrom(ResourceAmenityRepository.class));
    }
}

package lk.sliit.smartcampus.assets;

import lk.sliit.smartcampus.assets.repository.ResourceTypeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ResourceTypeRepositoryTest {

    @Test
    void repositoryShouldExtendJpaRepository() {
        assertTrue(JpaRepository.class.isAssignableFrom(ResourceTypeRepository.class));
    }
}

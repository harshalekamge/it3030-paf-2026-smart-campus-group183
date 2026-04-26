package lk.sliit.smartcampus.assets;

import lk.sliit.smartcampus.assets.repository.ResourceMediaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ResourceMediaRepositoryTest {

    @Test
    void resourceMediaRepositoryShouldExtendJpaRepository() {
        assertTrue(JpaRepository.class.isAssignableFrom(ResourceMediaRepository.class));
    }
}

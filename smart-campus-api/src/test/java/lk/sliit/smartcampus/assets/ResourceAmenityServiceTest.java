package lk.sliit.smartcampus.assets;

import java.util.Optional;

import lk.sliit.smartcampus.assets.dto.ResourceAmenityDto;
import lk.sliit.smartcampus.assets.dto.ResourceAmenityRequestDto;
import lk.sliit.smartcampus.assets.entity.ResourceAmenity;
import lk.sliit.smartcampus.assets.entity.ResourceAmenityId;
import lk.sliit.smartcampus.assets.repository.ResourceAmenityRepository;
import lk.sliit.smartcampus.assets.service.ResourceAmenityServiceImpl;
import lk.sliit.smartcampus.common.exception.DuplicateResourceAmenityException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResourceAmenityServiceTest {

    @Mock
    private ResourceAmenityRepository resourceAmenityRepository;

    @InjectMocks
    private ResourceAmenityServiceImpl resourceAmenityService;

    @Test
    void createResourceAmenityShouldPersistMapping() {
        ResourceAmenityRequestDto request = new ResourceAmenityRequestDto(10, 3);
        ResourceAmenity saved = ResourceAmenity.builder()
                .id(new ResourceAmenityId(10, 3))
                .build();

        when(resourceAmenityRepository.existsByIdResourceIdAndIdAmenityId(10, 3)).thenReturn(false);
        when(resourceAmenityRepository.save(any(ResourceAmenity.class))).thenReturn(saved);

        ResourceAmenityDto response = resourceAmenityService.createResourceAmenity(request);

        assertEquals(10, response.resourceId());
        assertEquals(3, response.amenityId());
        verify(resourceAmenityRepository).save(any(ResourceAmenity.class));
    }

    @Test
    void createResourceAmenityShouldRejectDuplicateMapping() {
        ResourceAmenityRequestDto request = new ResourceAmenityRequestDto(10, 3);
        when(resourceAmenityRepository.existsByIdResourceIdAndIdAmenityId(10, 3)).thenReturn(true);

        assertThrows(DuplicateResourceAmenityException.class, () -> resourceAmenityService.createResourceAmenity(request));
    }

    @Test
    void updateResourceAmenityShouldReplaceCompositeKey() {
        ResourceAmenity existing = ResourceAmenity.builder()
                .id(new ResourceAmenityId(10, 3))
                .build();
        ResourceAmenity saved = ResourceAmenity.builder()
                .id(new ResourceAmenityId(10, 5))
                .build();

        when(resourceAmenityRepository.findById(new ResourceAmenityId(10, 3))).thenReturn(Optional.of(existing));
        when(resourceAmenityRepository.existsByIdResourceIdAndIdAmenityId(10, 5)).thenReturn(false);
        when(resourceAmenityRepository.save(any(ResourceAmenity.class))).thenReturn(saved);

        ResourceAmenityDto response = resourceAmenityService.updateResourceAmenity(10, 3, new ResourceAmenityRequestDto(10, 5));

        assertEquals(10, response.resourceId());
        assertEquals(5, response.amenityId());
        verify(resourceAmenityRepository).delete(existing);
        verify(resourceAmenityRepository).save(any(ResourceAmenity.class));
    }
}

package lk.sliit.smartcampus.assets;

import lk.sliit.smartcampus.assets.dto.ResourceTypeDto;
import lk.sliit.smartcampus.assets.dto.ResourceTypeRequestDto;
import lk.sliit.smartcampus.assets.entity.ResourceType;
import lk.sliit.smartcampus.assets.repository.ResourceTypeRepository;
import lk.sliit.smartcampus.assets.service.ResourceTypeServiceImpl;
import lk.sliit.smartcampus.common.exception.DuplicateResourceTypeCodeException;
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
class ResourceTypeServiceTest {

    @Mock
    private ResourceTypeRepository resourceTypeRepository;

    @InjectMocks
    private ResourceTypeServiceImpl resourceTypeService;

    @Test
    void createResourceTypeShouldPersistResourceType() {
        ResourceTypeRequestDto request = new ResourceTypeRequestDto(
                "ROOM", "Room", "Indoor room", true, true, false, "door"
        );
        ResourceType saved = ResourceType.builder()
                .id(1)
                .typeCode("ROOM")
                .typeName("Room")
                .description("Indoor room")
                .requiresCapacity(true)
                .requiresLocation(true)
                .isEquipment(false)
                .iconSlug("door")
                .build();

        when(resourceTypeRepository.existsByTypeCodeIgnoreCase("ROOM")).thenReturn(false);
        when(resourceTypeRepository.save(any(ResourceType.class))).thenReturn(saved);

        ResourceTypeDto response = resourceTypeService.createResourceType(request);

        assertEquals(1, response.id());
        assertEquals("ROOM", response.typeCode());
        verify(resourceTypeRepository).save(any(ResourceType.class));
    }

    @Test
    void createResourceTypeShouldRejectDuplicateCode() {
        ResourceTypeRequestDto request = new ResourceTypeRequestDto(
                "ROOM", "Room", null, null, null, null, null
        );
        when(resourceTypeRepository.existsByTypeCodeIgnoreCase("ROOM")).thenReturn(true);

        assertThrows(DuplicateResourceTypeCodeException.class, () -> resourceTypeService.createResourceType(request));
    }
}

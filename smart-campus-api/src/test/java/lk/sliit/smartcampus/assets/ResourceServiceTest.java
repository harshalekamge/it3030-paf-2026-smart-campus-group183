package lk.sliit.smartcampus.assets;

import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import lk.sliit.smartcampus.assets.dto.ResourceDto;
import lk.sliit.smartcampus.assets.dto.ResourceRequestDto;
import lk.sliit.smartcampus.assets.entity.Resource;
import lk.sliit.smartcampus.assets.repository.ResourceRepository;
import lk.sliit.smartcampus.assets.service.ResourceServiceImpl;
import lk.sliit.smartcampus.common.exception.DuplicateResourceCodeException;
import lk.sliit.smartcampus.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResourceServiceTest {

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private ResourceServiceImpl resourceService;

    @Test
    void createResourceShouldPersistResource() {
        ResourceRequestDto request = new ResourceRequestDto(
                2, null, " Main Hall ", " hall-01 ", " Large event hall ", List.of(" event ", "", " hall "),
                " A Block ", (short) 1, " 101 ", (short) 120, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, " https://cdn.example.com/hall.jpg "
        );
        Resource saved = Resource.builder()
                .id(1)
                .resourceTypeId(2)
                .name("Main Hall")
                .code("hall-01")
                .description("Large event hall")
                .tags(new String[]{"event", "hall"})
                .building("A Block")
                .floor((short) 1)
                .roomNo("101")
                .capacity((short) 120)
                .minCapacity((short) 1)
                .status("ACTIVE")
                .isActive(true)
                .maxBookingDuration((short) 240)
                .advanceBookingDays((short) 30)
                .requiresApproval(false)
                .minNoticeMinutes((short) 60)
                .defaultOpenTime(LocalTime.of(8, 0))
                .defaultCloseTime(LocalTime.of(18, 0))
                .isAccessible(false)
                .primaryImageUrl("https://cdn.example.com/hall.jpg")
                .updatedAt(OffsetDateTime.now())
                .build();

        when(resourceRepository.existsByCodeIgnoreCase(" hall-01 ")).thenReturn(false);
        when(resourceRepository.save(any(Resource.class))).thenReturn(saved);

        ResourceDto response = resourceService.createResource(request);

        assertEquals(1, response.id());
        assertEquals("hall-01", response.code());
        assertIterableEquals(List.of("event", "hall"), response.tags());
        verify(resourceRepository).save(any(Resource.class));
    }

    @Test
    void createResourceShouldRejectDuplicateCode() {
        ResourceRequestDto request = new ResourceRequestDto(
                2, null, "Main Hall", "HALL-01", null, null,
                null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null
        );
        when(resourceRepository.existsByCodeIgnoreCase("HALL-01")).thenReturn(true);

        assertThrows(DuplicateResourceCodeException.class, () -> resourceService.createResource(request));
    }

    @Test
    void updateResourceShouldThrowWhenResourceMissing() {
        when(resourceRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> resourceService.updateResource(
                        99,
                        new ResourceRequestDto(
                                2, null, "Main Hall", "HALL-01", null, null,
                                null, null, null, null, null, null, null,
                                null, null, null, null, null, null, null, null,
                                null, null, null, null, null
                        )
                )
        );
    }
}

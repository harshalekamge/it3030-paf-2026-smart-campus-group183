package lk.sliit.smartcampus.assets;

import java.time.OffsetDateTime;
import java.util.Optional;

import lk.sliit.smartcampus.assets.dto.ResourceMediaDto;
import lk.sliit.smartcampus.assets.dto.ResourceMediaRequestDto;
import lk.sliit.smartcampus.assets.entity.ResourceMedia;
import lk.sliit.smartcampus.assets.repository.ResourceMediaRepository;
import lk.sliit.smartcampus.assets.service.ResourceMediaServiceImpl;
import lk.sliit.smartcampus.common.exception.ResourceMediaNotFoundException;
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
class ResourceMediaServiceTest {

    @Mock
    private ResourceMediaRepository resourceMediaRepository;

    @InjectMocks
    private ResourceMediaServiceImpl resourceMediaService;

    @Test
    void createResourceMediaShouldPersistResourceMedia() {
        ResourceMediaRequestDto request = new ResourceMediaRequestDto(5, " https://cdn.example.com/a.jpg ", null, " Main photo ", null, null);
        ResourceMedia saved = ResourceMedia.builder()
                .id(1)
                .resourceId(5)
                .url("https://cdn.example.com/a.jpg")
                .mediaType("IMAGE")
                .caption("Main photo")
                .isPrimary(false)
                .displayOrder((short) 0)
                .uploadedAt(OffsetDateTime.now())
                .build();

        when(resourceMediaRepository.save(any(ResourceMedia.class))).thenReturn(saved);

        ResourceMediaDto response = resourceMediaService.createResourceMedia(request);

        assertEquals(1, response.id());
        assertEquals("IMAGE", response.mediaType());
        assertEquals("Main photo", response.caption());
        verify(resourceMediaRepository).save(any(ResourceMedia.class));
    }

    @Test
    void updateResourceMediaShouldThrowWhenRecordMissing() {
        when(resourceMediaRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(
                ResourceMediaNotFoundException.class,
                () -> resourceMediaService.updateResourceMedia(99, new ResourceMediaRequestDto(1, "https://x", "VIDEO", null, true, (short) 1))
        );
    }
}

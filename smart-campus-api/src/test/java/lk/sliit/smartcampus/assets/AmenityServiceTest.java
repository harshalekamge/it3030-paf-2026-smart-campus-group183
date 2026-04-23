package lk.sliit.smartcampus.assets;

import java.util.Optional;

import lk.sliit.smartcampus.assets.dto.AmenityDto;
import lk.sliit.smartcampus.assets.dto.AmenityRequestDto;
import lk.sliit.smartcampus.assets.entity.Amenity;
import lk.sliit.smartcampus.assets.repository.AmenityRepository;
import lk.sliit.smartcampus.assets.service.AmenityServiceImpl;
import lk.sliit.smartcampus.common.exception.DuplicateAmenityCodeException;
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
class AmenityServiceTest {

    @Mock
    private AmenityRepository amenityRepository;

    @InjectMocks
    private AmenityServiceImpl amenityService;

    @Test
    void createAmenityShouldPersistAmenity() {
        AmenityRequestDto request = new AmenityRequestDto("WIFI", "Wi-Fi", "wifi");
        Amenity saved = Amenity.builder()
                .id(1)
                .code("WIFI")
                .label("Wi-Fi")
                .iconSlug("wifi")
                .build();

        when(amenityRepository.existsByCodeIgnoreCase("WIFI")).thenReturn(false);
        when(amenityRepository.save(any(Amenity.class))).thenReturn(saved);

        AmenityDto response = amenityService.createAmenity(request);

        assertEquals(1, response.id());
        assertEquals("WIFI", response.code());
        verify(amenityRepository).save(any(Amenity.class));
    }

    @Test
    void createAmenityShouldRejectDuplicateCode() {
        AmenityRequestDto request = new AmenityRequestDto("WIFI", "Wi-Fi", "wifi");
        when(amenityRepository.existsByCodeIgnoreCase("WIFI")).thenReturn(true);

        assertThrows(DuplicateAmenityCodeException.class, () -> amenityService.createAmenity(request));
    }
}

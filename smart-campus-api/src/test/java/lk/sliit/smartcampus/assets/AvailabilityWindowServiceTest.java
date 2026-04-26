package lk.sliit.smartcampus.assets;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import lk.sliit.smartcampus.assets.dto.AvailabilityWindowDto;
import lk.sliit.smartcampus.assets.dto.AvailabilityWindowRequestDto;
import lk.sliit.smartcampus.assets.entity.AvailabilityWindow;
import lk.sliit.smartcampus.assets.repository.AvailabilityWindowRepository;
import lk.sliit.smartcampus.assets.service.AvailabilityWindowServiceImpl;
import lk.sliit.smartcampus.common.exception.AvailabilityWindowNotFoundException;
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
class AvailabilityWindowServiceTest {

    @Mock
    private AvailabilityWindowRepository availabilityWindowRepository;

    @InjectMocks
    private AvailabilityWindowServiceImpl availabilityWindowService;

    @Test
    void createAvailabilityWindowShouldPersistAvailabilityWindow() {
        AvailabilityWindowRequestDto request = new AvailabilityWindowRequestDto(
                5,
                (short) 1,
                null,
                LocalTime.of(8, 0),
                LocalTime.of(17, 0),
                null,
                null,
                " Weekday window "
        );

        AvailabilityWindow saved = AvailabilityWindow.builder()
                .id(1)
                .resourceId(5)
                .dayOfWeek((short) 1)
                .specificDate(null)
                .openTime(LocalTime.of(8, 0))
                .closeTime(LocalTime.of(17, 0))
                .isClosed(false)
                .validFrom(LocalDate.now())
                .validUntil(null)
                .note("Weekday window")
                .build();

        when(availabilityWindowRepository.save(any(AvailabilityWindow.class))).thenReturn(saved);

        AvailabilityWindowDto response = availabilityWindowService.createAvailabilityWindow(request);

        assertEquals(1, response.id());
        assertEquals(false, response.isClosed());
        assertEquals("Weekday window", response.note());
        verify(availabilityWindowRepository).save(any(AvailabilityWindow.class));
    }

    @Test
    void getAvailabilityWindowByIdShouldThrowWhenRecordMissing() {
        when(availabilityWindowRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(
                AvailabilityWindowNotFoundException.class,
                () -> availabilityWindowService.getAvailabilityWindowById(99)
        );
    }
}

package lk.sliit.smartcampus.assets;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;

import lk.sliit.smartcampus.assets.dto.MaintenanceLogDto;
import lk.sliit.smartcampus.assets.dto.MaintenanceLogRequestDto;
import lk.sliit.smartcampus.assets.entity.MaintenanceLog;
import lk.sliit.smartcampus.assets.repository.MaintenanceLogRepository;
import lk.sliit.smartcampus.assets.service.MaintenanceLogServiceImpl;
import lk.sliit.smartcampus.common.exception.MaintenanceLogNotFoundException;
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
class MaintenanceLogServiceTest {

    @Mock
    private MaintenanceLogRepository maintenanceLogRepository;

    @InjectMocks
    private MaintenanceLogServiceImpl maintenanceLogService;

    @Test
    void createMaintenanceLogShouldPersistMaintenanceLog() {
        MaintenanceLogRequestDto request = new MaintenanceLogRequestDto(
                5,
                2,
                "AVAILABLE",
                "MAINTENANCE",
                "Electrical",
                " Power issue in room ",
                null,
                new BigDecimal("1500.00"),
                " EXT-1001 "
        );

        MaintenanceLog saved = MaintenanceLog.builder()
                .id(1)
                .resourceId(5)
                .reportedBy(2)
                .priorStatus("AVAILABLE")
                .newStatus("MAINTENANCE")
                .category("Electrical")
                .description("Power issue in room")
                .startedAt(OffsetDateTime.now())
                .resolvedAt(null)
                .cost(new BigDecimal("1500.00"))
                .externalRef("EXT-1001")
                .build();

        when(maintenanceLogRepository.save(any(MaintenanceLog.class))).thenReturn(saved);

        MaintenanceLogDto response = maintenanceLogService.createMaintenanceLog(request);

        assertEquals(1, response.id());
        assertEquals("Power issue in room", response.description());
        assertEquals("EXT-1001", response.externalRef());
        verify(maintenanceLogRepository).save(any(MaintenanceLog.class));
    }

    @Test
    void getMaintenanceLogByIdShouldThrowWhenRecordMissing() {
        when(maintenanceLogRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(
                MaintenanceLogNotFoundException.class,
                () -> maintenanceLogService.getMaintenanceLogById(99)
        );
    }
}

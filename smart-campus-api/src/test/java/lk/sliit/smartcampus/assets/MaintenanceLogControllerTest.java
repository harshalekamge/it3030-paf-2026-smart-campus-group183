package lk.sliit.smartcampus.assets;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import lk.sliit.smartcampus.assets.controller.MaintenanceLogController;
import lk.sliit.smartcampus.assets.dto.MaintenanceLogDto;
import lk.sliit.smartcampus.assets.dto.MaintenanceLogRequestDto;
import lk.sliit.smartcampus.assets.service.MaintenanceLogService;
import lk.sliit.smartcampus.common.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MaintenanceLogController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class MaintenanceLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MaintenanceLogService maintenanceLogService;

    @Test
    void getAllMaintenanceLogsShouldReturnWrappedResponse() throws Exception {
        when(maintenanceLogService.getAllMaintenanceLogs()).thenReturn(List.of(
                new MaintenanceLogDto(
                        1,
                        2,
                        3,
                        "AVAILABLE",
                        "MAINTENANCE",
                        "Electrical",
                        "Power issue",
                        OffsetDateTime.now(),
                        null,
                        new BigDecimal("1500.00"),
                        "EXT-1001"
                )
        ));

        mockMvc.perform(get("/maintenance-logs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].resourceId").value(2))
                .andExpect(jsonPath("$.data[0].category").value("Electrical"));
    }

    @Test
    void createMaintenanceLogShouldReturnCreated() throws Exception {
        MaintenanceLogRequestDto request = new MaintenanceLogRequestDto(
                2,
                3,
                "AVAILABLE",
                "MAINTENANCE",
                "Electrical",
                "Power issue",
                null,
                new BigDecimal("1500.00"),
                "EXT-1001"
        );

        MaintenanceLogDto response = new MaintenanceLogDto(
                3,
                2,
                3,
                "AVAILABLE",
                "MAINTENANCE",
                "Electrical",
                "Power issue",
                OffsetDateTime.now(),
                null,
                new BigDecimal("1500.00"),
                "EXT-1001"
        );

        when(maintenanceLogService.createMaintenanceLog(any(MaintenanceLogRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/maintenance-logs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(3))
                .andExpect(jsonPath("$.data.externalRef").value("EXT-1001"));
    }
}

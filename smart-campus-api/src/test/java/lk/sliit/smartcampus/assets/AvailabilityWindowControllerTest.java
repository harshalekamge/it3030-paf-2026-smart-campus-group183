package lk.sliit.smartcampus.assets;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import lk.sliit.smartcampus.assets.controller.AvailabilityWindowController;
import lk.sliit.smartcampus.assets.dto.AvailabilityWindowDto;
import lk.sliit.smartcampus.assets.dto.AvailabilityWindowRequestDto;
import lk.sliit.smartcampus.assets.service.AvailabilityWindowService;
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

@WebMvcTest(AvailabilityWindowController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class AvailabilityWindowControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AvailabilityWindowService availabilityWindowService;

    @Test
    void getAllAvailabilityWindowsShouldReturnWrappedResponse() throws Exception {
        when(availabilityWindowService.getAllAvailabilityWindows()).thenReturn(List.of(
                new AvailabilityWindowDto(
                        1,
                        2,
                        (short) 1,
                        null,
                        LocalTime.of(8, 0),
                        LocalTime.of(17, 0),
                        false,
                        LocalDate.now(),
                        null,
                        "Weekday window"
                )
        ));

        mockMvc.perform(get("/availability-windows"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].resourceId").value(2))
                .andExpect(jsonPath("$.data[0].dayOfWeek").value(1));
    }

    @Test
    void createAvailabilityWindowShouldReturnCreated() throws Exception {
        AvailabilityWindowRequestDto request = new AvailabilityWindowRequestDto(
                2,
                (short) 1,
                null,
                LocalTime.of(8, 0),
                LocalTime.of(17, 0),
                false,
                null,
                "Weekday window"
        );

        AvailabilityWindowDto response = new AvailabilityWindowDto(
                3,
                2,
                (short) 1,
                null,
                LocalTime.of(8, 0),
                LocalTime.of(17, 0),
                false,
                LocalDate.now(),
                null,
                "Weekday window"
        );

        when(availabilityWindowService.createAvailabilityWindow(any(AvailabilityWindowRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/availability-windows")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(3))
                .andExpect(jsonPath("$.data.resourceId").value(2));
    }
}

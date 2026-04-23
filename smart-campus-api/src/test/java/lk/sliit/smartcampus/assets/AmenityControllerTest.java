package lk.sliit.smartcampus.assets;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import lk.sliit.smartcampus.assets.controller.AmenityController;
import lk.sliit.smartcampus.assets.dto.AmenityDto;
import lk.sliit.smartcampus.assets.dto.AmenityRequestDto;
import lk.sliit.smartcampus.assets.service.AmenityService;
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

@WebMvcTest(AmenityController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class AmenityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AmenityService amenityService;

    @Test
    void getAllAmenitiesShouldReturnWrappedResponse() throws Exception {
        when(amenityService.getAllAmenities()).thenReturn(List.of(new AmenityDto(1, "WIFI", "Wi-Fi", "wifi")));

        mockMvc.perform(get("/amenities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].code").value("WIFI"));
    }

    @Test
    void createAmenityShouldReturnCreated() throws Exception {
        AmenityRequestDto request = new AmenityRequestDto("LAB", "Computer Lab", "monitor");
        AmenityDto response = new AmenityDto(2, "LAB", "Computer Lab", "monitor");

        when(amenityService.createAmenity(any(AmenityRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/amenities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(2))
                .andExpect(jsonPath("$.data.label").value("Computer Lab"));
    }
}

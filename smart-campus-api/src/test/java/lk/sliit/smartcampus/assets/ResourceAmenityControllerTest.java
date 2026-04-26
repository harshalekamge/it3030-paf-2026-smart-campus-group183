package lk.sliit.smartcampus.assets;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import lk.sliit.smartcampus.assets.controller.ResourceAmenityController;
import lk.sliit.smartcampus.assets.dto.ResourceAmenityDto;
import lk.sliit.smartcampus.assets.dto.ResourceAmenityRequestDto;
import lk.sliit.smartcampus.assets.service.ResourceAmenityService;
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

@WebMvcTest(ResourceAmenityController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ResourceAmenityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ResourceAmenityService resourceAmenityService;

    @Test
    void getAllResourceAmenitiesShouldReturnWrappedResponse() throws Exception {
        when(resourceAmenityService.getAllResourceAmenities()).thenReturn(List.of(new ResourceAmenityDto(1, 2)));

        mockMvc.perform(get("/resource-amenities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].resourceId").value(1))
                .andExpect(jsonPath("$.data[0].amenityId").value(2));
    }

    @Test
    void createResourceAmenityShouldReturnCreated() throws Exception {
        ResourceAmenityRequestDto request = new ResourceAmenityRequestDto(7, 4);
        ResourceAmenityDto response = new ResourceAmenityDto(7, 4);

        when(resourceAmenityService.createResourceAmenity(any(ResourceAmenityRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/resource-amenities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.resourceId").value(7))
                .andExpect(jsonPath("$.data.amenityId").value(4));
    }
}

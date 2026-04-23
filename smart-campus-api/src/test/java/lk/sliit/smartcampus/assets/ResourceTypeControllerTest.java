package lk.sliit.smartcampus.assets;

import java.time.OffsetDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import lk.sliit.smartcampus.assets.controller.ResourceTypeController;
import lk.sliit.smartcampus.assets.dto.ResourceTypeDto;
import lk.sliit.smartcampus.assets.dto.ResourceTypeRequestDto;
import lk.sliit.smartcampus.assets.service.ResourceTypeService;
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

@WebMvcTest(ResourceTypeController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ResourceTypeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ResourceTypeService resourceTypeService;

    @Test
    void getAllResourceTypesShouldReturnWrappedResponse() throws Exception {
        when(resourceTypeService.getAllResourceTypes()).thenReturn(List.of(
                new ResourceTypeDto(1, "ROOM", "Room", "Indoor room", true, true, false, "door", OffsetDateTime.now())
        ));

        mockMvc.perform(get("/resource-types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].typeCode").value("ROOM"));
    }

    @Test
    void createResourceTypeShouldReturnCreated() throws Exception {
        ResourceTypeRequestDto request = new ResourceTypeRequestDto(
                "LAB", "Laboratory", "Science lab", true, true, false, "flask"
        );
        ResourceTypeDto response = new ResourceTypeDto(
                2, "LAB", "Laboratory", "Science lab", true, true, false, "flask", OffsetDateTime.now()
        );

        when(resourceTypeService.createResourceType(any(ResourceTypeRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/resource-types")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(2))
                .andExpect(jsonPath("$.data.typeName").value("Laboratory"));
    }
}

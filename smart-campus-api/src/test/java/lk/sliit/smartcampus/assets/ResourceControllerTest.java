package lk.sliit.smartcampus.assets;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import lk.sliit.smartcampus.assets.controller.ResourceController;
import lk.sliit.smartcampus.assets.dto.ResourceDto;
import lk.sliit.smartcampus.assets.dto.ResourceRequestDto;
import lk.sliit.smartcampus.assets.service.ResourceService;
import lk.sliit.smartcampus.common.exception.GlobalExceptionHandler;
import lk.sliit.smartcampus.common.web.WebCacheService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ResourceController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ResourceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ResourceService resourceService;

    @MockBean
    private WebCacheService webCacheService;

    @Test
    void getAllResourcesShouldReturnWrappedResponse() throws Exception {
        when(webCacheService.buildEtag(any())).thenReturn("\"resources-etag\"");
        when(webCacheService.isNotModified(any(), any())).thenReturn(false);
        when(webCacheService.privateCachePolicy(anyLong())).thenReturn(CacheControl.noCache());

        when(resourceService.getAllResources()).thenReturn(List.of(
                new ResourceDto(
                        1, 2, null, "Main Hall", "HALL-01", null, List.of("event"),
                        "A Block", (short) 1, "101", (short) 120, (short) 1,
                        "ACTIVE", true, null, null, null, null, (short) 240,
                        (short) 30, false, (short) 60, null, null, false, null,
                        null, null, null
                )
        ));

        mockMvc.perform(get("/resources"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].code").value("HALL-01"));
    }

    @Test
    void createResourceShouldReturnCreated() throws Exception {
        ResourceRequestDto request = new ResourceRequestDto(
                2, null, "Main Hall", "HALL-01", "Large event hall", List.of("event", "hall"),
                "A Block", (short) 1, "101", (short) 120, (short) 10, "ACTIVE", true,
                null, null, null, null, (short) 240, (short) 30, false, (short) 60,
                null, null, false, null, "https://cdn.example.com/hall.jpg"
        );
        ResourceDto response = new ResourceDto(
                1, 2, null, "Main Hall", "HALL-01", "Large event hall", List.of("event", "hall"),
                "A Block", (short) 1, "101", (short) 120, (short) 10, "ACTIVE", true,
                null, null, null, null, (short) 240, (short) 30, false, (short) 60,
                null, null, false, null, "https://cdn.example.com/hall.jpg", null, null
        );

        when(resourceService.createResource(any(ResourceRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/resources")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("Main Hall"));
    }
}

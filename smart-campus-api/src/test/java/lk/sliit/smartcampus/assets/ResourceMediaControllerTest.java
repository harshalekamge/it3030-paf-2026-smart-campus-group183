package lk.sliit.smartcampus.assets;

import java.time.OffsetDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import lk.sliit.smartcampus.assets.controller.ResourceMediaController;
import lk.sliit.smartcampus.assets.dto.ResourceMediaDto;
import lk.sliit.smartcampus.assets.dto.ResourceMediaRequestDto;
import lk.sliit.smartcampus.assets.service.ResourceMediaService;
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

@WebMvcTest(ResourceMediaController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ResourceMediaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ResourceMediaService resourceMediaService;

    @Test
    void getAllResourceMediaShouldReturnWrappedResponse() throws Exception {
        when(resourceMediaService.getAllResourceMedia()).thenReturn(List.of(
                new ResourceMediaDto(1, 2, "https://cdn.example.com/image.jpg", "IMAGE", "Front view", true, (short) 0, OffsetDateTime.now())
        ));

        mockMvc.perform(get("/resource-media"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].resourceId").value(2))
                .andExpect(jsonPath("$.data[0].mediaType").value("IMAGE"));
    }

    @Test
    void createResourceMediaShouldReturnCreated() throws Exception {
        ResourceMediaRequestDto request = new ResourceMediaRequestDto(2, "https://cdn.example.com/image.jpg", "IMAGE", "Front view", true, (short) 1);
        ResourceMediaDto response = new ResourceMediaDto(3, 2, "https://cdn.example.com/image.jpg", "IMAGE", "Front view", true, (short) 1, OffsetDateTime.now());

        when(resourceMediaService.createResourceMedia(any(ResourceMediaRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/resource-media")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(3))
                .andExpect(jsonPath("$.data.url").value("https://cdn.example.com/image.jpg"));
    }
}

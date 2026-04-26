package lk.sliit.smartcampus.common;

import lk.sliit.smartcampus.common.web.ClientScriptController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ClientScriptController.class)
@AutoConfigureMockMvc(addFilters = false)
class ClientScriptControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldServeExecutableJavascriptForCodeOnDemand() throws Exception {
        mockMvc.perform(get("/client-scripts/resource-summary.js"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "max-age=3600, public"))
                .andExpect(content().contentType("application/javascript"))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("export function buildResourceInsight")));
    }
}

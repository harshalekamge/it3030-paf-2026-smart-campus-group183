package lk.sliit.smartcampus.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import lk.sliit.smartcampus.auth.controller.UserController;
import lk.sliit.smartcampus.auth.dto.UserResponseDto;
import lk.sliit.smartcampus.auth.enums.Role;
import lk.sliit.smartcampus.auth.service.JwtService;
import lk.sliit.smartcampus.auth.service.OAuthUserService;
import lk.sliit.smartcampus.auth.service.OidcUserService;
import lk.sliit.smartcampus.auth.service.UserService;
import lk.sliit.smartcampus.config.AuthCookieService;
import lk.sliit.smartcampus.config.OAuth2FailureHandler;
import lk.sliit.smartcampus.config.OAuth2SuccessHandler;
import lk.sliit.smartcampus.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private OAuthUserService oAuthUserService;

    @MockitoBean
    private OidcUserService oidcUserService;

    @MockitoBean
    private OAuth2SuccessHandler oAuth2SuccessHandler;

    @MockitoBean
    private OAuth2FailureHandler oAuth2FailureHandler;

    @MockitoBean
    private AuthCookieService authCookieService;

    @Test
    void shouldRequireAuthenticationForCurrentUser() throws Exception {
        mockMvc.perform(get("/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldUseOauthEmailClaimForCurrentUser() throws Exception {
        when(userService.getCurrentUser("student@sliit.lk"))
                .thenReturn(new UserResponseDto(1L, "student@sliit.lk", "Smart", "Student", "Smart Student", null, Role.STUDENT, true));

        mockMvc.perform(get("/users/me")
                        .with(oauth2Login().attributes(attributes -> {
                            attributes.put("email", "student@sliit.lk");
                            attributes.put("sub", "102729476187587056982");
                        })))
                .andExpect(status().isOk());

        verify(userService).getCurrentUser("student@sliit.lk");
    }

    @Test
    @WithMockUser(username = "admin@sliit.lk", roles = "ADMIN")
    void shouldBlockAdminFromUpdatingRoles() throws Exception {
        mockMvc.perform(patch("/users/1/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"role\":\"LECTURER\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "super@sliit.lk", roles = "SUPER_ADMIN")
    void shouldAllowSuperAdminToUpdateRoles() throws Exception {
        when(userService.updateUserRole(eq(1L), eq(Role.LECTURER), eq("super@sliit.lk")))
                .thenReturn(new UserResponseDto(1L, "user@sliit.lk", "A", "B", "A B", null, Role.LECTURER, true));

        mockMvc.perform(patch("/users/1/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of("role", "LECTURER"))))
                .andExpect(status().isOk());

        verify(userService).updateUserRole(1L, Role.LECTURER, "super@sliit.lk");
    }
}

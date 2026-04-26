package lk.sliit.smartcampus.auth;

import lk.sliit.smartcampus.auth.entity.AppUser;
import lk.sliit.smartcampus.auth.enums.Role;
import lk.sliit.smartcampus.auth.service.JwtService;
import lk.sliit.smartcampus.auth.service.UserService;
import lk.sliit.smartcampus.config.AuthCookieService;
import lk.sliit.smartcampus.config.HttpCookieOAuth2AuthorizationRequestRepository;
import lk.sliit.smartcampus.config.OAuth2SuccessHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

class OAuth2SuccessHandlerTest {

    private JwtService jwtService;
    private UserService userService;
    private OAuth2SuccessHandler successHandler;

    @BeforeEach
    void setUp() {
        jwtService = Mockito.mock(JwtService.class);
        userService = Mockito.mock(UserService.class);

        AuthCookieService authCookieService = new AuthCookieService(
                "SC_AUTH_TOKEN",
                "/api",
                false,
                "Lax",
                3600000L
        );
        HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository =
                new HttpCookieOAuth2AuthorizationRequestRepository("/api", false, "Lax");

        successHandler = new OAuth2SuccessHandler(
                jwtService,
                userService,
                authCookieService,
                authorizationRequestRepository
        );
        ReflectionTestUtils.setField(successHandler, "frontendUrl", "http://localhost:5175");
    }

    @Test
    void shouldSetHttpOnlyCookieAndRedirectWithoutTokenInUrl() throws Exception {
        AppUser appUser = new AppUser();
        appUser.setEmail("student@sliit.lk");
        appUser.setRole(Role.STUDENT);

        when(userService.getUserEntityByEmail("student@sliit.lk")).thenReturn(appUser);
        when(jwtService.generateToken(appUser)).thenReturn("jwt-token");

        DefaultOAuth2User principal = new DefaultOAuth2User(
                List.of(),
                Map.of("email", "student@sliit.lk"),
                "email"
        );

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        successHandler.onAuthenticationSuccess(
                request,
                response,
                new TestingAuthenticationToken(principal, null)
        );

        String setCookie = response.getHeader("Set-Cookie");
        assertTrue(setCookie.contains("SC_AUTH_TOKEN=jwt-token"));
        assertTrue(setCookie.contains("HttpOnly"));
        assertFalse(response.getRedirectedUrl().contains("token="));
        assertTrue("http://localhost:5175/auth-demo.html?oauth=success".equals(response.getRedirectedUrl()));
    }
}

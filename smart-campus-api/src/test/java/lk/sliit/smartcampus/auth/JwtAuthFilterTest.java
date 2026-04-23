package lk.sliit.smartcampus.auth;

import jakarta.servlet.FilterChain;
import lk.sliit.smartcampus.auth.entity.AppUser;
import lk.sliit.smartcampus.auth.enums.Role;
import lk.sliit.smartcampus.auth.service.JwtService;
import lk.sliit.smartcampus.auth.service.UserService;
import lk.sliit.smartcampus.config.AuthCookieService;
import lk.sliit.smartcampus.config.JwtAuthFilter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class JwtAuthFilterTest {

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldAuthenticateUsingHttpOnlyCookieWhenHeaderIsMissing() throws Exception {
        JwtService jwtService = Mockito.mock(JwtService.class);
        UserService userService = Mockito.mock(UserService.class);
        AuthCookieService authCookieService = new AuthCookieService(
                "SC_AUTH_TOKEN",
                "/api",
                false,
                "Lax",
                3600000L
        );

        JwtAuthFilter filter = new JwtAuthFilter(jwtService, userService, authCookieService);

        AppUser user = new AppUser();
        user.setEmail("student@sliit.lk");
        user.setRole(Role.STUDENT);

        when(jwtService.extractUsername("jwt-token")).thenReturn("student@sliit.lk");
        when(userService.getUserEntityByEmail("student@sliit.lk")).thenReturn(user);
        when(jwtService.isTokenValid("jwt-token", "student@sliit.lk")).thenReturn(true);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new jakarta.servlet.http.Cookie("SC_AUTH_TOKEN", "jwt-token"));

        filter.doFilter(
                request,
                new MockHttpServletResponse(),
                Mockito.mock(FilterChain.class)
        );

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("student@sliit.lk", SecurityContextHolder.getContext().getAuthentication().getName());
        verify(jwtService).extractUsername("jwt-token");
    }
}

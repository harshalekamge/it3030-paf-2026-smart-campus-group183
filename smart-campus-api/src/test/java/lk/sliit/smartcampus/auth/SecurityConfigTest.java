package lk.sliit.smartcampus.auth;

import lk.sliit.smartcampus.auth.service.OAuthUserService;
import lk.sliit.smartcampus.auth.service.OidcUserService;
import lk.sliit.smartcampus.config.OAuth2FailureHandler;
import lk.sliit.smartcampus.config.OAuth2SuccessHandler;
import lk.sliit.smartcampus.config.SecurityConfig;
import lk.sliit.smartcampus.config.HttpCookieOAuth2AuthorizationRequestRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class SecurityConfigTest {

    @Test
    void shouldCreateSecurityConfig() {
        SecurityConfig config = new SecurityConfig(
                Mockito.mock(OAuthUserService.class),
                Mockito.mock(OidcUserService.class),
                Mockito.mock(OAuth2SuccessHandler.class),
                Mockito.mock(OAuth2FailureHandler.class),
                Mockito.mock(HttpCookieOAuth2AuthorizationRequestRepository.class)
        );

        assertNotNull(config);
    }
}

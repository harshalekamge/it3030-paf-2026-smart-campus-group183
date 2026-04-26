package lk.sliit.smartcampus.auth;

import jakarta.servlet.http.Cookie;
import lk.sliit.smartcampus.config.HttpCookieOAuth2AuthorizationRequestRepository;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HttpCookieOAuth2AuthorizationRequestRepositoryTest {

    @Test
    void shouldStoreLoadAndClearAuthorizationRequestUsingCookies() {
        HttpCookieOAuth2AuthorizationRequestRepository repository =
                new HttpCookieOAuth2AuthorizationRequestRepository("/api", false, "Lax");

        OAuth2AuthorizationRequest authorizationRequest = OAuth2AuthorizationRequest.authorizationCode()
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .clientId("client-id")
                .redirectUri("http://localhost:8080/login/oauth2/code/google")
                .state("test-state")
                .authorizationRequestUri("https://accounts.google.com/o/oauth2/v2/auth?state=test-state")
                .build();

        MockHttpServletRequest saveRequest = new MockHttpServletRequest();
        MockHttpServletResponse saveResponse = new MockHttpServletResponse();

        repository.saveAuthorizationRequest(authorizationRequest, saveRequest, saveResponse);

        String setCookieHeader = saveResponse.getHeader("Set-Cookie");
        assertNotNull(setCookieHeader);
        assertTrue(setCookieHeader.contains("SC_OAUTH2_AUTH_REQUEST="));

        String encodedValue = setCookieHeader.split(";", 2)[0].split("=", 2)[1];
        MockHttpServletRequest loadRequest = new MockHttpServletRequest();
        loadRequest.setCookies(new Cookie(HttpCookieOAuth2AuthorizationRequestRepository.AUTH_REQUEST_COOKIE_NAME, encodedValue));

        OAuth2AuthorizationRequest loadedRequest = repository.loadAuthorizationRequest(loadRequest);
        assertNotNull(loadedRequest);
        assertEquals("test-state", loadedRequest.getState());

        MockHttpServletResponse clearResponse = new MockHttpServletResponse();
        OAuth2AuthorizationRequest removedRequest = repository.removeAuthorizationRequest(loadRequest, clearResponse);

        assertNotNull(removedRequest);
        assertEquals("test-state", removedRequest.getState());
        assertTrue(clearResponse.getHeader("Set-Cookie").contains("Max-Age=0"));

        MockHttpServletRequest emptyRequest = new MockHttpServletRequest();
        assertNull(repository.loadAuthorizationRequest(emptyRequest));
    }
}

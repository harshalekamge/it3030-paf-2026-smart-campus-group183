package lk.sliit.smartcampus.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.SerializationUtils;

import java.time.Duration;
import java.util.Arrays;
import java.util.Base64;
import java.util.Optional;

@Component
public class HttpCookieOAuth2AuthorizationRequestRepository
        implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    public static final String AUTH_REQUEST_COOKIE_NAME = "SC_OAUTH2_AUTH_REQUEST";
    private static final Duration COOKIE_TTL = Duration.ofMinutes(3);

    private final String cookiePath;
    private final boolean cookieSecure;
    private final String sameSite;

    public HttpCookieOAuth2AuthorizationRequestRepository(
            @Value("${app.auth.cookie-path}") String cookiePath,
            @Value("${app.auth.cookie-secure:false}") boolean cookieSecure,
            @Value("${app.auth.cookie-same-site:Lax}") String sameSite
    ) {
        this.cookiePath = cookiePath;
        this.cookieSecure = cookieSecure;
        this.sameSite = sameSite;
    }

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return extractCookieValue(request, AUTH_REQUEST_COOKIE_NAME)
                .map(this::deserialize)
                .orElse(null);
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest,
                                         HttpServletRequest request,
                                         HttpServletResponse response) {
        if (authorizationRequest == null) {
            addCookie(response, "", request.isSecure(), Duration.ZERO);
            return;
        }

        String serializedRequest = serialize(authorizationRequest);
        addCookie(response, serializedRequest, request.isSecure(), COOKIE_TTL);
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request,
                                                                 HttpServletResponse response) {
        OAuth2AuthorizationRequest authorizationRequest = loadAuthorizationRequest(request);
        addCookie(response, "", request.isSecure(), Duration.ZERO);
        return authorizationRequest;
    }

    public void clearAuthorizationRequestCookies(HttpServletRequest request, HttpServletResponse response) {
        addCookie(response, "", request.isSecure(), Duration.ZERO);
    }

    private Optional<String> extractCookieValue(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }

        return Arrays.stream(cookies)
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .filter(value -> value != null && !value.isBlank())
                .findFirst();
    }

    private void addCookie(HttpServletResponse response, String value, boolean secureRequest, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(AUTH_REQUEST_COOKIE_NAME, value)
                .httpOnly(true)
                .secure(cookieSecure || secureRequest)
                .path(cookiePath)
                .sameSite(sameSite)
                .maxAge(maxAge)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String serialize(OAuth2AuthorizationRequest authorizationRequest) {
        byte[] bytes = SerializationUtils.serialize(authorizationRequest);
        if (bytes == null) {
            throw new IllegalStateException("Failed to serialize OAuth2 authorization request");
        }
        return Base64.getUrlEncoder().encodeToString(bytes);
    }

    private OAuth2AuthorizationRequest deserialize(String value) {
        byte[] bytes = Base64.getUrlDecoder().decode(value);
        Object deserialized = SerializationUtils.deserialize(bytes);
        if (!(deserialized instanceof OAuth2AuthorizationRequest authorizationRequest)) {
            throw new IllegalStateException("Failed to deserialize OAuth2 authorization request");
        }
        return authorizationRequest;
    }
}

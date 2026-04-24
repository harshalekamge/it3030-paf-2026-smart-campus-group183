package lk.sliit.smartcampus.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

@Component
public class AuthCookieService {

    private final String cookieName;
    private final String cookiePath;
    private final boolean cookieSecure;
    private final String sameSite;
    private final long jwtExpiration;

    public AuthCookieService(@Value("${app.auth.cookie-name}") String cookieName,
                             @Value("${app.auth.cookie-path}") String cookiePath,
                             @Value("${app.auth.cookie-secure:false}") boolean cookieSecure,
                             @Value("${app.auth.cookie-same-site:Lax}") String sameSite,
                             @Value("${app.jwt.expiration}") long jwtExpiration) {
        this.cookieName = cookieName;
        this.cookiePath = cookiePath;
        this.cookieSecure = cookieSecure;
        this.sameSite = sameSite;
        this.jwtExpiration = jwtExpiration;
    }

    public ResponseCookie buildTokenCookie(String token, boolean secureRequest) {
        return baseCookie(token, secureRequest)
                .maxAge(Duration.ofMillis(jwtExpiration))
                .build();
    }

    public ResponseCookie buildClearCookie(boolean secureRequest) {
        return baseCookie("", secureRequest)
                .maxAge(Duration.ZERO)
                .build();
    }

    public Optional<String> extractToken(HttpServletRequest request) {
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

    private ResponseCookie.ResponseCookieBuilder baseCookie(String value, boolean secureRequest) {
        return ResponseCookie.from(cookieName, value)
                .httpOnly(true)
                .secure(cookieSecure || secureRequest)
                .path(cookiePath)
                .sameSite(sameSite);
    }
}

package lk.sliit.smartcampus.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private final AuthCookieService authCookieService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public OAuth2FailureHandler(AuthCookieService authCookieService) {
        this.authCookieService = authCookieService;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {

        response.addHeader(HttpHeaders.SET_COOKIE,
                authCookieService.buildClearCookie(request.isSecure()).toString());

        String message = URLEncoder.encode(exception.getMessage(), StandardCharsets.UTF_8);
        String redirectUrl = frontendUrl + "/auth-demo.html?oauth=failure&error=" + message;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}

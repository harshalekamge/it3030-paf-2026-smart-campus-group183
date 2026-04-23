package lk.sliit.smartcampus.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.sliit.smartcampus.auth.entity.AppUser;
import lk.sliit.smartcampus.auth.service.JwtService;
import lk.sliit.smartcampus.auth.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserService userService;
    private final AuthCookieService authCookieService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public OAuth2SuccessHandler(JwtService jwtService,
                                UserService userService,
                                AuthCookieService authCookieService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.authCookieService = authCookieService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");

        AppUser appUser = userService.getUserEntityByEmail(email);
        String token = jwtService.generateToken(appUser);

        response.addHeader(HttpHeaders.SET_COOKIE,
                authCookieService.buildTokenCookie(token, request.isSecure()).toString());

        String redirectUrl = frontendUrl + "/oauth-success";
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}

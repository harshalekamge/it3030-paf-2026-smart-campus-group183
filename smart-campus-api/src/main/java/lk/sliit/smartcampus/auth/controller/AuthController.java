package lk.sliit.smartcampus.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.sliit.smartcampus.config.AuthCookieService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthCookieService authCookieService;

    public AuthController(AuthCookieService authCookieService) {
        this.authCookieService = authCookieService;
    }

    @GetMapping("/login-success")
    public ResponseEntity<String> loginSuccess() {
        return ResponseEntity.ok("OAuth login successful");
    }

    @GetMapping("/login-failure")
    public ResponseEntity<String> loginFailure() {
        return ResponseEntity.status(401).body("OAuth login failed");
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE,
                authCookieService.buildClearCookie(request.isSecure()).toString());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}

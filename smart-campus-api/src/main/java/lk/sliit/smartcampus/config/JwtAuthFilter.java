package lk.sliit.smartcampus.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.sliit.smartcampus.auth.entity.AppUser;
import lk.sliit.smartcampus.auth.service.JwtService;
import lk.sliit.smartcampus.auth.service.UserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import io.jsonwebtoken.JwtException;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;
    private final AuthCookieService authCookieService;

    public JwtAuthFilter(JwtService jwtService, UserService userService, AuthCookieService authCookieService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.authCookieService = authCookieService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = resolveToken(request);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }
        String email;

        try {
            email = jwtService.extractUsername(token);
        } catch (JwtException | IllegalArgumentException ex) {
            filterChain.doFilter(request, response);
            return;
        }

        if (email != null) {
            AppUser user;

            try {
                user = userService.getUserEntityByEmail(email);
            } catch (RuntimeException ex) {
                filterChain.doFilter(request, response);
                return;
            }

            boolean validToken;
            try {
                validToken = jwtService.isTokenValid(token, user.getEmail());
            } catch (JwtException | IllegalArgumentException ex) {
                filterChain.doFilter(request, response);
                return;
            }

            if (validToken) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        return authCookieService.extractToken(request).orElse(null);
    }
}

package lk.sliit.smartcampus.config;

import lk.sliit.smartcampus.auth.service.OAuthUserService;
import lk.sliit.smartcampus.auth.service.OidcUserService;
import lk.sliit.smartcampus.auth.service.JwtService;
import lk.sliit.smartcampus.auth.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final OAuthUserService oAuthUserService;
    private final OidcUserService oidcUserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;
    private final HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository;

    public SecurityConfig(OAuthUserService oAuthUserService,
                          OidcUserService oidcUserService,
                          OAuth2SuccessHandler oAuth2SuccessHandler,
                          OAuth2FailureHandler oAuth2FailureHandler,
                          HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository) {
        this.oAuthUserService = oAuthUserService;
        this.oidcUserService = oidcUserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.oAuth2FailureHandler = oAuth2FailureHandler;
        this.authorizationRequestRepository = authorizationRequestRepository;
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter(JwtService jwtService,
                                       UserService userService,
                                       AuthCookieService authCookieService) {
        return new JwtAuthFilter(jwtService, userService, authCookieService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions ->
                        exceptions.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                        .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/hello",
                                "/auth-demo.html",
                                "/client-scripts/**",
                                "/oauth2/**",
                                "/login/**",
                                "/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .requestMatchers("/users/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/users").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/users/*/role").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/resource-types").hasAnyRole("ADMIN", "SUPER_ADMIN", "STAFF", "LECTURER")
                        .requestMatchers(HttpMethod.GET, "/resource-types", "/resource-types/*").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/resource-types/*").hasAnyRole("ADMIN", "SUPER_ADMIN", "STAFF", "LECTURER")
                        .requestMatchers(HttpMethod.DELETE, "/resource-types/*").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/amenities").hasAnyRole("ADMIN", "SUPER_ADMIN", "STAFF", "LECTURER")
                        .requestMatchers(HttpMethod.GET, "/amenities", "/amenities/*").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/amenities/*").hasAnyRole("ADMIN", "SUPER_ADMIN", "STAFF", "LECTURER")
                        .requestMatchers(HttpMethod.DELETE, "/amenities/*").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
                        .authorizationEndpoint(authorization -> authorization
                                .authorizationRequestRepository(authorizationRequestRepository))
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oAuthUserService)
                                .oidcUserService(oidcUserService))
                        .successHandler(oAuth2SuccessHandler)
                        .failureHandler(oAuth2FailureHandler)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

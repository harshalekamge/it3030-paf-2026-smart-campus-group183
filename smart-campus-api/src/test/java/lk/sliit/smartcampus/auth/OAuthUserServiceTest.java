package lk.sliit.smartcampus.auth;

import lk.sliit.smartcampus.auth.entity.AppUser;
import lk.sliit.smartcampus.auth.enums.Role;
import lk.sliit.smartcampus.auth.repository.UserRepository;
import lk.sliit.smartcampus.auth.service.OAuthUserService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OAuthUserServiceTest {

    @Test
    void shouldUpdateExistingUserFoundByGoogleId() {
        UserRepository repository = Mockito.mock(UserRepository.class);
        OAuthUserService service = new OAuthUserService(repository);

        AppUser existingUser = new AppUser();
        existingUser.setEmail("student@sliit.lk");
        existingUser.setRole(Role.ADMIN);

        when(repository.findByGoogleId("google-123")).thenReturn(Optional.of(existingUser));

        OAuth2User oauthUser = new DefaultOAuth2User(
                java.util.List.of(),
                Map.of(
                        "sub", "google-123",
                        "email", "student@sliit.lk",
                        "email_verified", true,
                        "given_name", "Smart",
                        "family_name", "Student",
                        "name", "Smart Student",
                        "picture", "https://example.com/avatar.png"
                ),
                "sub"
        );

        try (MockedConstruction<DefaultOAuth2UserService> ignored = Mockito.mockConstruction(
                DefaultOAuth2UserService.class,
                (mock, context) -> when(mock.loadUser(any(OAuth2UserRequest.class))).thenReturn(oauthUser))) {

            service.loadUser(Mockito.mock(OAuth2UserRequest.class));
        }

        ArgumentCaptor<AppUser> userCaptor = ArgumentCaptor.forClass(AppUser.class);
        verify(repository).save(userCaptor.capture());

        assertEquals("google-123", userCaptor.getValue().getGoogleId());
        assertEquals("student@sliit.lk", userCaptor.getValue().getEmail());
        assertEquals(Role.ADMIN, userCaptor.getValue().getRole());
    }

    @Test
    void shouldRejectUnverifiedGoogleEmail() {
        UserRepository repository = Mockito.mock(UserRepository.class);
        OAuthUserService service = new OAuthUserService(repository);

        OAuth2User oauthUser = new DefaultOAuth2User(
                java.util.List.of(),
                Map.of(
                        "sub", "google-123",
                        "email", "student@sliit.lk",
                        "email_verified", false,
                        "name", "Smart Student"
                ),
                "sub"
        );

        try (MockedConstruction<DefaultOAuth2UserService> ignored = Mockito.mockConstruction(
                DefaultOAuth2UserService.class,
                (mock, context) -> when(mock.loadUser(any(OAuth2UserRequest.class))).thenReturn(oauthUser))) {

            assertThrows(OAuth2AuthenticationException.class,
                    () -> service.loadUser(Mockito.mock(OAuth2UserRequest.class)));
        }
    }
}

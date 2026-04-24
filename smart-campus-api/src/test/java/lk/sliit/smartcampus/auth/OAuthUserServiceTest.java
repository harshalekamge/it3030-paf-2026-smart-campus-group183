package lk.sliit.smartcampus.auth;

import lk.sliit.smartcampus.auth.service.OAuthUserService;
import lk.sliit.smartcampus.auth.service.UserProvisioningService;
import org.junit.jupiter.api.Test;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

class OAuthUserServiceTest {

    @Test
    void shouldProvisionUserFromOauthAttributes() {
        UserProvisioningService userProvisioningService = Mockito.mock(UserProvisioningService.class);
        OAuthUserService service = new OAuthUserService(userProvisioningService);

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
        Mockito.verify(userProvisioningService).provisionGoogleUser(oauthUser.getAttributes());
    }

    @Test
    void shouldRejectUnverifiedGoogleEmail() {
        UserProvisioningService userProvisioningService = Mockito.mock(UserProvisioningService.class);
        OAuthUserService service = new OAuthUserService(userProvisioningService);

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

            when(userProvisioningService.provisionGoogleUser(oauthUser.getAttributes()))
                    .thenThrow(new OAuth2AuthenticationException("email_not_verified"));

            assertThrows(OAuth2AuthenticationException.class, () -> service.loadUser(Mockito.mock(OAuth2UserRequest.class)));
        }
    }
}

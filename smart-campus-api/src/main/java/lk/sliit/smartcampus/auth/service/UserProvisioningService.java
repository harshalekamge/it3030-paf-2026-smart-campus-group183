package lk.sliit.smartcampus.auth.service;

import lk.sliit.smartcampus.auth.entity.AppUser;
import lk.sliit.smartcampus.auth.enums.Role;
import lk.sliit.smartcampus.auth.repository.UserRepository;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Map;

@Service
public class UserProvisioningService {

    private final UserRepository userRepository;

    public UserProvisioningService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AppUser provisionGoogleUser(Map<String, Object> attributes) {
        String googleId = getString(attributes, "sub");
        String email = getString(attributes, "email");
        Boolean emailVerified = (Boolean) attributes.get("email_verified");
        String firstName = getString(attributes, "given_name");
        String lastName = getString(attributes, "family_name");
        String fullName = getString(attributes, "name");
        String picture = getString(attributes, "picture");

        if (googleId == null || googleId.isBlank() || email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("invalid_user_info"),
                    "Google account did not provide the required user details"
            );
        }

        if (Boolean.FALSE.equals(emailVerified)) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("email_not_verified"),
                    "Google account email address is not verified"
            );
        }

        AppUser appUser = userRepository.findByGoogleId(googleId)
                .or(() -> userRepository.findByEmail(email))
                .orElseGet(AppUser::new);

        appUser.setGoogleId(googleId);
        appUser.setEmail(email);
        appUser.setFirstName(firstName);
        appUser.setLastName(lastName);
        appUser.setFullName(fullName);
        appUser.setProfilePictureUrl(picture);
        appUser.setProvider("GOOGLE");
        appUser.setIsActive(true);

        if (appUser.getRole() == null) {
            appUser.setRole(Role.STUDENT);
        }

        appUser.setLastLoginAt(OffsetDateTime.now());
        return userRepository.save(appUser);
    }

    private String getString(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        return value instanceof String ? (String) value : null;
    }
}

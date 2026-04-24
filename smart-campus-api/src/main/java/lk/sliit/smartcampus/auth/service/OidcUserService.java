package lk.sliit.smartcampus.auth.service;

import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

@Service
public class OidcUserService extends org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService {

    private final UserProvisioningService userProvisioningService;

    public OidcUserService(UserProvisioningService userProvisioningService) {
        this.userProvisioningService = userProvisioningService;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        userProvisioningService.provisionGoogleUser(oidcUser.getAttributes());
        return oidcUser;
    }
}

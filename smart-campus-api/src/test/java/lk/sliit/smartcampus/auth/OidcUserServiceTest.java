package lk.sliit.smartcampus.auth;

import lk.sliit.smartcampus.auth.service.OidcUserService;
import lk.sliit.smartcampus.auth.service.UserProvisioningService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class OidcUserServiceTest {

    @Test
    void shouldCreateService() {
        OidcUserService service = new OidcUserService(Mockito.mock(UserProvisioningService.class));
        assertNotNull(service);
    }
}

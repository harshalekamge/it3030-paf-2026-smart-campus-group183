package lk.sliit.smartcampus.auth;

import lk.sliit.smartcampus.auth.entity.AppUser;
import lk.sliit.smartcampus.auth.enums.Role;
import lk.sliit.smartcampus.auth.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "jwtSecret", "12345678901234567890123456789012");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 3600000L);
    }

    @Test
    void shouldGenerateAndValidateToken() {
        AppUser user = new AppUser();
        user.setEmail("test@gmail.com");
        user.setRole(Role.STUDENT);

        String token = jwtService.generateToken(user);

        assertNotNull(token);
        assertEquals("test@gmail.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, "test@gmail.com"));
    }
}

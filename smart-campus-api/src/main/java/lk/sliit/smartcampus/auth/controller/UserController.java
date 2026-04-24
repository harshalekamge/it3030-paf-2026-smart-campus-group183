package lk.sliit.smartcampus.auth.controller;

import jakarta.validation.Valid;
import lk.sliit.smartcampus.auth.dto.RoleUpdateDto;
import lk.sliit.smartcampus.auth.dto.UserResponseDto;
import lk.sliit.smartcampus.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.getCurrentUser(resolveUserEmail(authentication)));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponseDto> updateRole(@PathVariable Long id,
                                                      @Valid @RequestBody RoleUpdateDto dto,
                                                      Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.updateUserRole(id, dto.getRole(), resolveUserEmail(authentication)));
    }

    private String resolveUserEmail(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof OAuth2AuthenticatedPrincipal oauthPrincipal) {
            String email = oauthPrincipal.getAttribute("email");
            if (email != null && !email.isBlank()) {
                return email;
            }
        }

        return authentication.getName();
    }
}

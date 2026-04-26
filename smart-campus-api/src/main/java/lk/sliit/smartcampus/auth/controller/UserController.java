package lk.sliit.smartcampus.auth.controller;

import jakarta.validation.Valid;
import lk.sliit.smartcampus.auth.dto.RoleUpdateDto;
import lk.sliit.smartcampus.auth.dto.UserRequestDto;
import lk.sliit.smartcampus.auth.dto.UserResponseDto;
import lk.sliit.smartcampus.auth.service.UserService;
import lk.sliit.smartcampus.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", userService.getUserById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponseDto>> createUser(@Valid @RequestBody UserRequestDto requestDto,
                                                                   Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserResponseDto user = userService.createUser(requestDto, resolveUserEmail(authentication));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUser(@PathVariable Long id,
                                                                   @Valid @RequestBody UserRequestDto requestDto,
                                                                   Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(
                ApiResponse.success(
                        "User updated successfully",
                        userService.updateUser(id, requestDto, resolveUserEmail(authentication))
                )
        );
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateRole(@PathVariable Long id,
                                                                   @Valid @RequestBody RoleUpdateDto dto,
                                                                   Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(
                ApiResponse.success(
                        "User role updated successfully",
                        userService.updateUserRole(id, dto.getRole(), resolveUserEmail(authentication))
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        userService.deleteUser(id, resolveUserEmail(authentication));
        return ResponseEntity.noContent().build();
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

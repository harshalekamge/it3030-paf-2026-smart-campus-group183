package lk.sliit.smartcampus.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lk.sliit.smartcampus.auth.dto.RoleUpdateDto;
import lk.sliit.smartcampus.auth.dto.UserRequestDto;
import lk.sliit.smartcampus.auth.dto.UserResponseDto;
import lk.sliit.smartcampus.auth.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "Users", description = "APIs for authenticated profile access and admin user management")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Returns the currently authenticated user's profile")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Current user retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User is not authenticated", content = @Content)
    })
    public ResponseEntity<UserResponseDto> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.getCurrentUser(resolveUserEmail(authentication)));
    }

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieves all application users for admin management")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<List<UserResponseDto>>> getAllUsers() {
        return ResponseEntity.ok(lk.sliit.smartcampus.common.response.ApiResponse.success("Users retrieved successfully", userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by id", description = "Retrieves a single application user by database id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<UserResponseDto>> getUserById(@Parameter(description = "User id", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(lk.sliit.smartcampus.common.response.ApiResponse.success("User retrieved successfully", userService.getUserById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a user", description = "Creates a new application user record")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "401", description = "User is not authenticated", content = @Content),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content),
            @ApiResponse(responseCode = "409", description = "Duplicate user email or Google ID", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<UserResponseDto>> createUser(@Valid @RequestBody UserRequestDto requestDto,
                                                                   Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserResponseDto user = userService.createUser(requestDto, resolveUserEmail(authentication));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lk.sliit.smartcampus.common.response.ApiResponse.success("User created successfully", user));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a user", description = "Updates an existing application user by database id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "401", description = "User is not authenticated", content = @Content),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
            @ApiResponse(responseCode = "409", description = "Duplicate user email or Google ID", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<UserResponseDto>> updateUser(@Parameter(description = "User id", example = "1") @PathVariable Long id,
                                                                   @Valid @RequestBody UserRequestDto requestDto,
                                                                   Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "User updated successfully",
                        userService.updateUser(id, requestDto, resolveUserEmail(authentication))
                )
        );
    }

    @PatchMapping("/{id}/role")
    @Operation(summary = "Update user role", description = "Updates the role of an existing application user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User role updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "401", description = "User is not authenticated", content = @Content),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<UserResponseDto>> updateRole(@Parameter(description = "User id", example = "1") @PathVariable Long id,
                                                                   @Valid @RequestBody RoleUpdateDto dto,
                                                                   Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "User role updated successfully",
                        userService.updateUserRole(id, dto.getRole(), resolveUserEmail(authentication))
                )
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user", description = "Deletes an application user by database id")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "User deleted successfully"),
            @ApiResponse(responseCode = "401", description = "User is not authenticated", content = @Content),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    public ResponseEntity<Void> deleteUser(@Parameter(description = "User id", example = "1") @PathVariable Long id, Authentication authentication) {
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

package lk.sliit.smartcampus.auth.dto;

import lk.sliit.smartcampus.auth.enums.Role;

import java.time.OffsetDateTime;

public class UserResponseDto {

    private Long id;
    private String googleId;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String profilePictureUrl;
    private Role role;
    private Boolean isActive;
    private String provider;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private OffsetDateTime lastLoginAt;

    public UserResponseDto() {}

    public UserResponseDto(Long id, String googleId, String email, String firstName, String lastName,
                           String fullName, String profilePictureUrl, Role role, Boolean isActive,
                           String provider, OffsetDateTime createdAt, OffsetDateTime updatedAt,
                           OffsetDateTime lastLoginAt) {
        this.id = id;
        this.googleId = googleId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = fullName;
        this.profilePictureUrl = profilePictureUrl;
        this.role = role;
        this.isActive = isActive;
        this.provider = provider;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastLoginAt = lastLoginAt;
    }

    public Long getId() { return id; }
    public String getGoogleId() { return googleId; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getFullName() { return fullName; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public Role getRole() { return role; }
    public Boolean getIsActive() { return isActive; }
    public String getProvider() { return provider; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public OffsetDateTime getLastLoginAt() { return lastLoginAt; }
}

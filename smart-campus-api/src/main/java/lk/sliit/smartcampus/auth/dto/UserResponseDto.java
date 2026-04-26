package lk.sliit.smartcampus.auth.dto;

import lk.sliit.smartcampus.auth.enums.Role;

public class UserResponseDto {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String profilePictureUrl;
    private Role role;
    private Boolean isActive;

    public UserResponseDto() {}

    public UserResponseDto(Long id, String email, String firstName, String lastName,
                           String fullName, String profilePictureUrl, Role role, Boolean isActive) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = fullName;
        this.profilePictureUrl = profilePictureUrl;
        this.role = role;
        this.isActive = isActive;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getFullName() { return fullName; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public Role getRole() { return role; }
    public Boolean getIsActive() { return isActive; }
}
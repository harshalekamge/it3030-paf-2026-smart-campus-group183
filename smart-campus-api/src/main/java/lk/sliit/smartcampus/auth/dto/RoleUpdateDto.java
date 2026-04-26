package lk.sliit.smartcampus.auth.dto;

import jakarta.validation.constraints.NotNull;
import lk.sliit.smartcampus.auth.enums.Role;

public class RoleUpdateDto {

    @NotNull(message = "Role is required")
    private Role role;

    public RoleUpdateDto() {}

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
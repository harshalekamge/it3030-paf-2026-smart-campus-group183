package lk.sliit.smartcampus.auth.service;

import lk.sliit.smartcampus.auth.dto.UserResponseDto;
import lk.sliit.smartcampus.auth.entity.AppUser;
import lk.sliit.smartcampus.auth.enums.Role;

import java.util.List;

public interface UserService {
    AppUser getUserEntityByEmail(String email);
    UserResponseDto getCurrentUser(String email);
    List<UserResponseDto> getAllUsers();
    UserResponseDto updateUserRole(Long userId, Role role, String actorEmail);
}

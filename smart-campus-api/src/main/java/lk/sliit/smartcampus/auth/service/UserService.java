package lk.sliit.smartcampus.auth.service;

import lk.sliit.smartcampus.auth.dto.UserRequestDto;
import lk.sliit.smartcampus.auth.dto.UserResponseDto;
import lk.sliit.smartcampus.auth.entity.AppUser;
import lk.sliit.smartcampus.auth.enums.Role;

import java.util.List;

public interface UserService {
    AppUser getUserEntityByEmail(String email);
    UserResponseDto getCurrentUser(String email);
    List<UserResponseDto> getAllUsers();
    UserResponseDto getUserById(Long userId);
    UserResponseDto createUser(UserRequestDto requestDto, String actorEmail);
    UserResponseDto updateUser(Long userId, UserRequestDto requestDto, String actorEmail);
    UserResponseDto updateUserRole(Long userId, Role role, String actorEmail);
    void deleteUser(Long userId, String actorEmail);
}

package lk.sliit.smartcampus.auth.service.impl;

import lk.sliit.smartcampus.auth.dto.UserRequestDto;
import lk.sliit.smartcampus.auth.dto.UserResponseDto;
import lk.sliit.smartcampus.auth.entity.AppUser;
import lk.sliit.smartcampus.auth.enums.Role;
import lk.sliit.smartcampus.auth.exception.DuplicateGoogleIdException;
import lk.sliit.smartcampus.auth.exception.DuplicateUserEmailException;
import lk.sliit.smartcampus.auth.exception.RoleAssignmentNotAllowedException;
import lk.sliit.smartcampus.auth.exception.UserNotFoundException;
import lk.sliit.smartcampus.auth.repository.UserRepository;
import lk.sliit.smartcampus.auth.service.UserService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AppUser getUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    @Override
    public UserResponseDto getCurrentUser(String email) {
        return mapToDto(getUserEntityByEmail(email));
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public UserResponseDto getUserById(Long userId) {
        return mapToDto(getUserByIdOrThrow(userId));
    }

    @Override
    public UserResponseDto createUser(UserRequestDto requestDto, String actorEmail) {
        ensureActorCanManageUsers(actorEmail);
        validateUniqueFields(requestDto, null);

        AppUser user = new AppUser();
        applyUserRequest(user, requestDto);

        return mapToDto(userRepository.save(user));
    }

    @Override
    public UserResponseDto updateUser(Long userId, UserRequestDto requestDto, String actorEmail) {
        ensureActorCanManageUsers(actorEmail);

        AppUser user = getUserByIdOrThrow(userId);
        validateUniqueFields(requestDto, user);
        applyUserRequest(user, requestDto);

        return mapToDto(userRepository.save(user));
    }

    @Override
    public UserResponseDto updateUserRole(Long userId, Role role, String actorEmail) {
        ensureActorCanManageUsers(actorEmail);
        AppUser user = getUserByIdOrThrow(userId);
        user.setRole(role);
        return mapToDto(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long userId, String actorEmail) {
        AppUser actor = ensureActorCanManageUsers(actorEmail);

        if (actor.getId() != null && actor.getId().equals(userId)) {
            throw new RoleAssignmentNotAllowedException("You cannot delete your own account");
        }

        AppUser user = getUserByIdOrThrow(userId);
        userRepository.delete(user);
    }

    private AppUser ensureActorCanManageUsers(String actorEmail) {
        AppUser actor = getUserEntityByEmail(actorEmail);
        if (actor.getRole() != Role.ADMIN && actor.getRole() != Role.SUPER_ADMIN) {
            throw new RoleAssignmentNotAllowedException("Only admins can manage users");
        }
        return actor;
    }

    private AppUser getUserByIdOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
    }

    private void validateUniqueFields(UserRequestDto requestDto, AppUser existingUser) {
        String normalizedEmail = normalize(requestDto.getEmail());
        String normalizedGoogleId = normalize(requestDto.getGoogleId());

        boolean emailChanged = existingUser == null || !normalizedEmail.equalsIgnoreCase(normalize(existingUser.getEmail()));
        if (emailChanged && userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateUserEmailException("A user already exists with email: " + normalizedEmail);
        }

        if (normalizedGoogleId != null) {
            boolean googleIdChanged = existingUser == null || !normalizedGoogleId.equals(normalize(existingUser.getGoogleId()));
            if (googleIdChanged && userRepository.existsByGoogleId(normalizedGoogleId)) {
                throw new DuplicateGoogleIdException("A user already exists with google id: " + normalizedGoogleId);
            }
        }
    }

    private void applyUserRequest(AppUser user, UserRequestDto requestDto) {
        user.setGoogleId(normalize(requestDto.getGoogleId()));
        user.setEmail(normalize(requestDto.getEmail()));
        user.setFirstName(normalize(requestDto.getFirstName()));
        user.setLastName(normalize(requestDto.getLastName()));
        user.setFullName(resolveFullName(requestDto));
        user.setProfilePictureUrl(normalize(requestDto.getProfilePictureUrl()));
        user.setRole(requestDto.getRole());
        user.setIsActive(requestDto.getIsActive());
        user.setProvider(normalize(requestDto.getProvider()));
    }

    private String resolveFullName(UserRequestDto requestDto) {
        String explicitFullName = normalize(requestDto.getFullName());
        if (explicitFullName != null) {
            return explicitFullName;
        }

        StringBuilder generatedFullName = new StringBuilder();
        if (normalize(requestDto.getFirstName()) != null) {
            generatedFullName.append(normalize(requestDto.getFirstName()));
        }
        if (normalize(requestDto.getLastName()) != null) {
            if (!generatedFullName.isEmpty()) {
                generatedFullName.append(' ');
            }
            generatedFullName.append(normalize(requestDto.getLastName()));
        }

        return generatedFullName.isEmpty() ? null : generatedFullName.toString();
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmedValue = value.trim();
        return trimmedValue.isEmpty() ? null : trimmedValue;
    }

    private UserResponseDto mapToDto(AppUser user) {
        return new UserResponseDto(
                user.getId(),
                user.getGoogleId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getFullName(),
                user.getProfilePictureUrl(),
                user.getRole(),
                user.getIsActive(),
                user.getProvider(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getLastLoginAt()
        );
    }
}

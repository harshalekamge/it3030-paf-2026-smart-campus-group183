package lk.sliit.smartcampus.auth;

import lk.sliit.smartcampus.auth.entity.AppUser;
import lk.sliit.smartcampus.auth.enums.Role;
import lk.sliit.smartcampus.auth.exception.RoleAssignmentNotAllowedException;
import lk.sliit.smartcampus.auth.repository.UserRepository;
import lk.sliit.smartcampus.auth.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

class UserServiceImplTest {

    @Test
    void shouldAllowRoleUpdateFromAdmin() {
        UserRepository repository = Mockito.mock(UserRepository.class);
        UserServiceImpl service = new UserServiceImpl(repository);

        AppUser actor = new AppUser();
        actor.setEmail("admin@sliit.lk");
        actor.setRole(Role.ADMIN);

        AppUser target = new AppUser();
        target.setRole(Role.STUDENT);

        when(repository.findByEmail("admin@sliit.lk")).thenReturn(Optional.of(actor));
        when(repository.findById(10L)).thenReturn(Optional.of(target));
        when(repository.save(target)).thenReturn(target);

        assertDoesNotThrow(() -> service.updateUserRole(10L, Role.LECTURER, "admin@sliit.lk"));
    }

    @Test
    void shouldRejectRoleUpdateFromStaff() {
        UserRepository repository = Mockito.mock(UserRepository.class);
        UserServiceImpl service = new UserServiceImpl(repository);

        AppUser actor = new AppUser();
        actor.setEmail("staff@sliit.lk");
        actor.setRole(Role.STAFF);

        when(repository.findByEmail("staff@sliit.lk")).thenReturn(Optional.of(actor));

        assertThrows(RoleAssignmentNotAllowedException.class,
                () -> service.updateUserRole(10L, Role.LECTURER, "staff@sliit.lk"));
    }
}

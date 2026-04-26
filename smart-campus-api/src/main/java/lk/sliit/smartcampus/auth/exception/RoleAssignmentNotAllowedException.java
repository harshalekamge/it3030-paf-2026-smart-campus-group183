package lk.sliit.smartcampus.auth.exception;

public class RoleAssignmentNotAllowedException extends RuntimeException {

    public RoleAssignmentNotAllowedException(String message) {
        super(message);
    }
}

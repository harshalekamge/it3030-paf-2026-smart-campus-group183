package lk.sliit.smartcampus.common.exception;

import java.util.HashMap;
import java.util.Map;

import lk.sliit.smartcampus.auth.exception.DuplicateGoogleIdException;
import lk.sliit.smartcampus.auth.exception.DuplicateUserEmailException;
import lk.sliit.smartcampus.auth.exception.RoleAssignmentNotAllowedException;
import lk.sliit.smartcampus.auth.exception.UserNotFoundException;
import lk.sliit.smartcampus.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AmenityNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleAmenityNotFound(AmenityNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(DuplicateAmenityCodeException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateAmenityCode(DuplicateAmenityCodeException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(DuplicateResourceCodeException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResourceCode(DuplicateResourceCodeException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(ResourceTypeNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceTypeNotFound(ResourceTypeNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(DuplicateResourceTypeCodeException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResourceTypeCode(DuplicateResourceTypeCodeException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(ResourceAmenityNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceAmenityNotFound(ResourceAmenityNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(DuplicateResourceAmenityException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResourceAmenity(DuplicateResourceAmenityException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(ResourceMediaNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceMediaNotFound(ResourceMediaNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(AvailabilityWindowNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleAvailabilityWindowNotFound(AvailabilityWindowNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(MaintenanceLogNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaintenanceLogNotFound(MaintenanceLogNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserNotFound(UserNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(DuplicateUserEmailException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateUserEmail(DuplicateUserEmailException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(DuplicateGoogleIdException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateGoogleId(DuplicateGoogleIdException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(RoleAssignmentNotAllowedException.class)
    public ResponseEntity<ApiResponse<Void>> handleRoleAssignmentNotAllowed(RoleAssignmentNotAllowedException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.failure("Access denied", null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return ResponseEntity.badRequest()
                .body(ApiResponse.failure("Validation failed", errors));
    }
}

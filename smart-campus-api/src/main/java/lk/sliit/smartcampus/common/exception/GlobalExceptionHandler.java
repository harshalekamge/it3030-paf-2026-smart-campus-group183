package lk.sliit.smartcampus.common.exception;

import java.util.HashMap;
import java.util.Map;

import lk.sliit.smartcampus.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

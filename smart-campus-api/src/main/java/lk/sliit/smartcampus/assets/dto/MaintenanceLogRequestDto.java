package lk.sliit.smartcampus.assets.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record MaintenanceLogRequestDto(
        @NotNull(message = "Resource id is required")
        @Positive(message = "Resource id must be greater than 0")
        Integer resourceId,

        @Positive(message = "Reported by must be greater than 0")
        Integer reportedBy,

        @Size(max = 25, message = "Prior status must not exceed 25 characters")
        String priorStatus,

        @Size(max = 25, message = "New status must not exceed 25 characters")
        String newStatus,

        @Size(max = 50, message = "Category must not exceed 50 characters")
        String category,

        String description,

        OffsetDateTime resolvedAt,

        @DecimalMin(value = "0.00", inclusive = true, message = "Cost must be zero or greater")
        BigDecimal cost,

        @Size(max = 100, message = "External reference must not exceed 100 characters")
        String externalRef
) {
}

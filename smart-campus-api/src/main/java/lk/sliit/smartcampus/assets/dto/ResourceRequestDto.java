package lk.sliit.smartcampus.assets.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ResourceRequestDto(
        @NotNull(message = "Resource type id is required")
        @Positive(message = "Resource type id must be greater than 0")
        Integer resourceTypeId,

        @Positive(message = "Custodian id must be greater than 0")
        Integer custodianId,

        @NotBlank(message = "Name is required")
        @Size(max = 255, message = "Name must not exceed 255 characters")
        String name,

        @NotBlank(message = "Code is required")
        @Size(max = 50, message = "Code must not exceed 50 characters")
        String code,

        String description,

        List<@Size(max = 50, message = "Each tag must not exceed 50 characters") String> tags,

        @Size(max = 100, message = "Building must not exceed 100 characters")
        String building,

        Short floor,

        @Size(max = 50, message = "Room number must not exceed 50 characters")
        String roomNo,

        Short capacity,
        Short minCapacity,

        @Size(max = 25, message = "Status must not exceed 25 characters")
        String status,

        Boolean isActive,
        LocalDate purchaseDate,
        LocalDate lastServicedAt,
        LocalDate nextServiceDue,

        @DecimalMin(value = "0.00", inclusive = true, message = "Replacement cost must be zero or greater")
        BigDecimal replacementCost,

        Short maxBookingDuration,
        Short advanceBookingDays,
        Boolean requiresApproval,
        Short minNoticeMinutes,
        LocalTime defaultOpenTime,
        LocalTime defaultCloseTime,
        Boolean isAccessible,
        String accessibilityNotes,

        @Size(max = 500, message = "Primary image URL must not exceed 500 characters")
        String primaryImageUrl
) {
}

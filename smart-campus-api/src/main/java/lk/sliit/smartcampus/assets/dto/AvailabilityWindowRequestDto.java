package lk.sliit.smartcampus.assets.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record AvailabilityWindowRequestDto(
        @NotNull(message = "Resource id is required")
        @Positive(message = "Resource id must be greater than 0")
        Integer resourceId,

        @Min(value = 0, message = "Day of week must be between 0 and 6")
        @Max(value = 6, message = "Day of week must be between 0 and 6")
        Short dayOfWeek,

        LocalDate specificDate,

        @NotNull(message = "Open time is required")
        LocalTime openTime,

        @NotNull(message = "Close time is required")
        LocalTime closeTime,

        Boolean isClosed,

        LocalDate validUntil,

        @Size(max = 255, message = "Note must not exceed 255 characters")
        String note
) {
}

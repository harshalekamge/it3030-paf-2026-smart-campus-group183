package lk.sliit.smartcampus.assets.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ResourceAmenityRequestDto(
        @NotNull(message = "Resource id is required")
        @Positive(message = "Resource id must be greater than 0")
        Integer resourceId,

        @NotNull(message = "Amenity id is required")
        @Positive(message = "Amenity id must be greater than 0")
        Integer amenityId
) {
}

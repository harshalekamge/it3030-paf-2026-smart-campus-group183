package lk.sliit.smartcampus.assets.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResourceTypeRequestDto(
        @NotBlank(message = "Type code is required")
        @Size(max = 50, message = "Type code must not exceed 50 characters")
        String typeCode,

        @NotBlank(message = "Type name is required")
        @Size(max = 100, message = "Type name must not exceed 100 characters")
        String typeName,

        String description,

        Boolean requiresCapacity,
        Boolean requiresLocation,
        Boolean isEquipment,

        @Size(max = 100, message = "Icon slug must not exceed 100 characters")
        String iconSlug
) {
}

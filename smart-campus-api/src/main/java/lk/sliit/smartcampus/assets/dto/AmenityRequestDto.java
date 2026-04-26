package lk.sliit.smartcampus.assets.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AmenityRequestDto(
        @NotBlank(message = "Code is required")
        @Size(max = 50, message = "Code must not exceed 50 characters")
        String code,

        @NotBlank(message = "Label is required")
        @Size(max = 100, message = "Label must not exceed 100 characters")
        String label,

        @Size(max = 100, message = "Icon slug must not exceed 100 characters")
        String iconSlug
) {
}

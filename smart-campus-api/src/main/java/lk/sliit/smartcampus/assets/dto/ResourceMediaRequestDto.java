package lk.sliit.smartcampus.assets.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ResourceMediaRequestDto(
        @NotNull(message = "Resource id is required")
        @Positive(message = "Resource id must be greater than 0")
        Integer resourceId,

        @NotBlank(message = "URL is required")
        @Size(max = 500, message = "URL must not exceed 500 characters")
        String url,

        @Size(max = 10, message = "Media type must not exceed 10 characters")
        String mediaType,

        @Size(max = 255, message = "Caption must not exceed 255 characters")
        String caption,

        Boolean isPrimary,
        Short displayOrder
) {
}

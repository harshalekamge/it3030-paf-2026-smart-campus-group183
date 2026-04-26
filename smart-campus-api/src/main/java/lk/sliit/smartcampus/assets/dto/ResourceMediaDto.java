package lk.sliit.smartcampus.assets.dto;

import java.time.OffsetDateTime;

public record ResourceMediaDto(
        Integer id,
        Integer resourceId,
        String url,
        String mediaType,
        String caption,
        Boolean isPrimary,
        Short displayOrder,
        OffsetDateTime uploadedAt
) {
}

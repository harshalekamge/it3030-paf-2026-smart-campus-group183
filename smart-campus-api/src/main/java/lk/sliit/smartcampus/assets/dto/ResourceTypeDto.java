package lk.sliit.smartcampus.assets.dto;

import java.time.OffsetDateTime;

public record ResourceTypeDto(
        Integer id,
        String typeCode,
        String typeName,
        String description,
        Boolean requiresCapacity,
        Boolean requiresLocation,
        Boolean isEquipment,
        String iconSlug,
        OffsetDateTime createdAt
) {
}

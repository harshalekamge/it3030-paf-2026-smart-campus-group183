package lk.sliit.smartcampus.assets.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record MaintenanceLogDto(
        Integer id,
        Integer resourceId,
        Integer reportedBy,
        String priorStatus,
        String newStatus,
        String category,
        String description,
        OffsetDateTime startedAt,
        OffsetDateTime resolvedAt,
        BigDecimal cost,
        String externalRef
) {
}

package lk.sliit.smartcampus.assets.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;

public record ResourceDto(
        Integer id,
        Integer resourceTypeId,
        Integer custodianId,
        String name,
        String code,
        String description,
        List<String> tags,
        String building,
        Short floor,
        String roomNo,
        Short capacity,
        Short minCapacity,
        String status,
        Boolean isActive,
        LocalDate purchaseDate,
        LocalDate lastServicedAt,
        LocalDate nextServiceDue,
        BigDecimal replacementCost,
        Short maxBookingDuration,
        Short advanceBookingDays,
        Boolean requiresApproval,
        Short minNoticeMinutes,
        LocalTime defaultOpenTime,
        LocalTime defaultCloseTime,
        Boolean isAccessible,
        String accessibilityNotes,
        String primaryImageUrl,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}

package lk.sliit.smartcampus.assets.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record AvailabilityWindowDto(
        Integer id,
        Integer resourceId,
        Short dayOfWeek,
        LocalDate specificDate,
        LocalTime openTime,
        LocalTime closeTime,
        Boolean isClosed,
        LocalDate validFrom,
        LocalDate validUntil,
        String note
) {
}

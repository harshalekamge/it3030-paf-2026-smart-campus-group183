package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.AvailabilityWindowDto;
import lk.sliit.smartcampus.assets.dto.AvailabilityWindowRequestDto;
import lk.sliit.smartcampus.assets.entity.AvailabilityWindow;
import lk.sliit.smartcampus.assets.repository.AvailabilityWindowRepository;
import lk.sliit.smartcampus.common.exception.AvailabilityWindowNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AvailabilityWindowServiceImpl implements AvailabilityWindowService {

    private final AvailabilityWindowRepository availabilityWindowRepository;

    public AvailabilityWindowServiceImpl(AvailabilityWindowRepository availabilityWindowRepository) {
        this.availabilityWindowRepository = availabilityWindowRepository;
    }

    @Override
    public AvailabilityWindowDto createAvailabilityWindow(AvailabilityWindowRequestDto requestDto) {
        AvailabilityWindow availabilityWindow = AvailabilityWindow.builder()
                .resourceId(requestDto.resourceId())
                .dayOfWeek(requestDto.dayOfWeek())
                .specificDate(requestDto.specificDate())
                .openTime(requestDto.openTime())
                .closeTime(requestDto.closeTime())
                .isClosed(defaultBoolean(requestDto.isClosed()))
                .validUntil(requestDto.validUntil())
                .note(normalizeNullable(requestDto.note()))
                .build();

        return toDto(availabilityWindowRepository.save(availabilityWindow));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilityWindowDto> getAllAvailabilityWindows() {
        return availabilityWindowRepository.findAllByOrderByValidFromAscIdAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AvailabilityWindowDto getAvailabilityWindowById(Integer id) {
        return toDto(findAvailabilityWindow(id));
    }

    @Override
    public AvailabilityWindowDto updateAvailabilityWindow(Integer id, AvailabilityWindowRequestDto requestDto) {
        AvailabilityWindow availabilityWindow = findAvailabilityWindow(id);

        availabilityWindow.setResourceId(requestDto.resourceId());
        availabilityWindow.setDayOfWeek(requestDto.dayOfWeek());
        availabilityWindow.setSpecificDate(requestDto.specificDate());
        availabilityWindow.setOpenTime(requestDto.openTime());
        availabilityWindow.setCloseTime(requestDto.closeTime());
        availabilityWindow.setIsClosed(defaultBoolean(requestDto.isClosed()));
        availabilityWindow.setValidUntil(requestDto.validUntil());
        availabilityWindow.setNote(normalizeNullable(requestDto.note()));

        return toDto(availabilityWindowRepository.save(availabilityWindow));
    }

    @Override
    public void deleteAvailabilityWindow(Integer id) {
        AvailabilityWindow availabilityWindow = findAvailabilityWindow(id);
        availabilityWindowRepository.delete(availabilityWindow);
    }

    private AvailabilityWindow findAvailabilityWindow(Integer id) {
        return availabilityWindowRepository.findById(id)
                .orElseThrow(() -> new AvailabilityWindowNotFoundException("Availability window not found for id: " + id));
    }

    private AvailabilityWindowDto toDto(AvailabilityWindow availabilityWindow) {
        return new AvailabilityWindowDto(
                availabilityWindow.getId(),
                availabilityWindow.getResourceId(),
                availabilityWindow.getDayOfWeek(),
                availabilityWindow.getSpecificDate(),
                availabilityWindow.getOpenTime(),
                availabilityWindow.getCloseTime(),
                availabilityWindow.getIsClosed(),
                availabilityWindow.getValidFrom(),
                availabilityWindow.getValidUntil(),
                availabilityWindow.getNote()
        );
    }

    private Boolean defaultBoolean(Boolean value) {
        return value == null ? false : value;
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

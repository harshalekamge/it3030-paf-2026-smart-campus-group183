package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.MaintenanceLogDto;
import lk.sliit.smartcampus.assets.dto.MaintenanceLogRequestDto;
import lk.sliit.smartcampus.assets.entity.MaintenanceLog;
import lk.sliit.smartcampus.assets.repository.MaintenanceLogRepository;
import lk.sliit.smartcampus.common.exception.MaintenanceLogNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MaintenanceLogServiceImpl implements MaintenanceLogService {

    private final MaintenanceLogRepository maintenanceLogRepository;

    public MaintenanceLogServiceImpl(MaintenanceLogRepository maintenanceLogRepository) {
        this.maintenanceLogRepository = maintenanceLogRepository;
    }

    @Override
    public MaintenanceLogDto createMaintenanceLog(MaintenanceLogRequestDto requestDto) {
        MaintenanceLog maintenanceLog = MaintenanceLog.builder()
                .resourceId(requestDto.resourceId())
                .reportedBy(requestDto.reportedBy())
                .priorStatus(normalizeNullable(requestDto.priorStatus()))
                .newStatus(normalizeNullable(requestDto.newStatus()))
                .category(normalizeNullable(requestDto.category()))
                .description(normalizeNullable(requestDto.description()))
                .resolvedAt(requestDto.resolvedAt())
                .cost(requestDto.cost())
                .externalRef(normalizeNullable(requestDto.externalRef()))
                .build();

        return toDto(maintenanceLogRepository.save(maintenanceLog));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceLogDto> getAllMaintenanceLogs() {
        return maintenanceLogRepository.findAllByOrderByStartedAtDescIdDesc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceLogDto getMaintenanceLogById(Integer id) {
        return toDto(findMaintenanceLog(id));
    }

    @Override
    public MaintenanceLogDto updateMaintenanceLog(Integer id, MaintenanceLogRequestDto requestDto) {
        MaintenanceLog maintenanceLog = findMaintenanceLog(id);

        maintenanceLog.setResourceId(requestDto.resourceId());
        maintenanceLog.setReportedBy(requestDto.reportedBy());
        maintenanceLog.setPriorStatus(normalizeNullable(requestDto.priorStatus()));
        maintenanceLog.setNewStatus(normalizeNullable(requestDto.newStatus()));
        maintenanceLog.setCategory(normalizeNullable(requestDto.category()));
        maintenanceLog.setDescription(normalizeNullable(requestDto.description()));
        maintenanceLog.setResolvedAt(requestDto.resolvedAt());
        maintenanceLog.setCost(requestDto.cost());
        maintenanceLog.setExternalRef(normalizeNullable(requestDto.externalRef()));

        return toDto(maintenanceLogRepository.save(maintenanceLog));
    }

    @Override
    public void deleteMaintenanceLog(Integer id) {
        MaintenanceLog maintenanceLog = findMaintenanceLog(id);
        maintenanceLogRepository.delete(maintenanceLog);
    }

    private MaintenanceLog findMaintenanceLog(Integer id) {
        return maintenanceLogRepository.findById(id)
                .orElseThrow(() -> new MaintenanceLogNotFoundException("Maintenance log not found for id: " + id));
    }

    private MaintenanceLogDto toDto(MaintenanceLog maintenanceLog) {
        return new MaintenanceLogDto(
                maintenanceLog.getId(),
                maintenanceLog.getResourceId(),
                maintenanceLog.getReportedBy(),
                maintenanceLog.getPriorStatus(),
                maintenanceLog.getNewStatus(),
                maintenanceLog.getCategory(),
                maintenanceLog.getDescription(),
                maintenanceLog.getStartedAt(),
                maintenanceLog.getResolvedAt(),
                maintenanceLog.getCost(),
                maintenanceLog.getExternalRef()
        );
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

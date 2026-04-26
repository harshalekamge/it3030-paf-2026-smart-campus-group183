package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.MaintenanceLogDto;
import lk.sliit.smartcampus.assets.dto.MaintenanceLogRequestDto;

public interface MaintenanceLogService {

    MaintenanceLogDto createMaintenanceLog(MaintenanceLogRequestDto requestDto);

    List<MaintenanceLogDto> getAllMaintenanceLogs();

    MaintenanceLogDto getMaintenanceLogById(Integer id);

    MaintenanceLogDto updateMaintenanceLog(Integer id, MaintenanceLogRequestDto requestDto);

    void deleteMaintenanceLog(Integer id);
}

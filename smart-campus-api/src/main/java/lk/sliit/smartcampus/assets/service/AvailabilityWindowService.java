package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.AvailabilityWindowDto;
import lk.sliit.smartcampus.assets.dto.AvailabilityWindowRequestDto;

public interface AvailabilityWindowService {

    AvailabilityWindowDto createAvailabilityWindow(AvailabilityWindowRequestDto requestDto);

    List<AvailabilityWindowDto> getAllAvailabilityWindows();

    AvailabilityWindowDto getAvailabilityWindowById(Integer id);

    AvailabilityWindowDto updateAvailabilityWindow(Integer id, AvailabilityWindowRequestDto requestDto);

    void deleteAvailabilityWindow(Integer id);
}

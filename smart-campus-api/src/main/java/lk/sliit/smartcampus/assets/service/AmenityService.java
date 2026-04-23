package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.AmenityDto;
import lk.sliit.smartcampus.assets.dto.AmenityRequestDto;

public interface AmenityService {

    AmenityDto createAmenity(AmenityRequestDto requestDto);

    List<AmenityDto> getAllAmenities();

    AmenityDto getAmenityById(Integer id);

    AmenityDto updateAmenity(Integer id, AmenityRequestDto requestDto);

    void deleteAmenity(Integer id);
}

package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.ResourceAmenityDto;
import lk.sliit.smartcampus.assets.dto.ResourceAmenityRequestDto;

public interface ResourceAmenityService {

    ResourceAmenityDto createResourceAmenity(ResourceAmenityRequestDto requestDto);

    List<ResourceAmenityDto> getAllResourceAmenities();

    ResourceAmenityDto getResourceAmenityById(Integer resourceId, Integer amenityId);

    ResourceAmenityDto updateResourceAmenity(Integer resourceId, Integer amenityId, ResourceAmenityRequestDto requestDto);

    void deleteResourceAmenity(Integer resourceId, Integer amenityId);
}

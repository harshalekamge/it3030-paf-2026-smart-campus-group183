package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.ResourceTypeDto;
import lk.sliit.smartcampus.assets.dto.ResourceTypeRequestDto;

public interface ResourceTypeService {

    ResourceTypeDto createResourceType(ResourceTypeRequestDto requestDto);

    List<ResourceTypeDto> getAllResourceTypes();

    ResourceTypeDto getResourceTypeById(Integer id);

    ResourceTypeDto updateResourceType(Integer id, ResourceTypeRequestDto requestDto);

    void deleteResourceType(Integer id);
}

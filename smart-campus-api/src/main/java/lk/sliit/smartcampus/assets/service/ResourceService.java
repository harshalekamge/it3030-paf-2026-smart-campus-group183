package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.ResourceDto;
import lk.sliit.smartcampus.assets.dto.ResourceRequestDto;

public interface ResourceService {

    ResourceDto createResource(ResourceRequestDto requestDto);

    List<ResourceDto> getAllResources();

    ResourceDto getResourceById(Integer id);

    ResourceDto updateResource(Integer id, ResourceRequestDto requestDto);

    void deleteResource(Integer id);
}

package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.ResourceMediaDto;
import lk.sliit.smartcampus.assets.dto.ResourceMediaRequestDto;

public interface ResourceMediaService {

    ResourceMediaDto createResourceMedia(ResourceMediaRequestDto requestDto);

    List<ResourceMediaDto> getAllResourceMedia();

    ResourceMediaDto getResourceMediaById(Integer id);

    ResourceMediaDto updateResourceMedia(Integer id, ResourceMediaRequestDto requestDto);

    void deleteResourceMedia(Integer id);
}

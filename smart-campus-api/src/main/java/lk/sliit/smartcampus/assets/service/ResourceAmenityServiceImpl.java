package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.ResourceAmenityDto;
import lk.sliit.smartcampus.assets.dto.ResourceAmenityRequestDto;
import lk.sliit.smartcampus.assets.entity.ResourceAmenity;
import lk.sliit.smartcampus.assets.entity.ResourceAmenityId;
import lk.sliit.smartcampus.assets.repository.ResourceAmenityRepository;
import lk.sliit.smartcampus.common.exception.DuplicateResourceAmenityException;
import lk.sliit.smartcampus.common.exception.ResourceAmenityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResourceAmenityServiceImpl implements ResourceAmenityService {

    private final ResourceAmenityRepository resourceAmenityRepository;

    public ResourceAmenityServiceImpl(ResourceAmenityRepository resourceAmenityRepository) {
        this.resourceAmenityRepository = resourceAmenityRepository;
    }

    @Override
    public ResourceAmenityDto createResourceAmenity(ResourceAmenityRequestDto requestDto) {
        ResourceAmenityId id = toId(requestDto);
        validateDuplicate(id, null);

        ResourceAmenity resourceAmenity = ResourceAmenity.builder()
                .id(id)
                .build();

        return toDto(resourceAmenityRepository.save(resourceAmenity));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceAmenityDto> getAllResourceAmenities() {
        return resourceAmenityRepository.findAllByOrderByIdResourceIdAscIdAmenityIdAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceAmenityDto getResourceAmenityById(Integer resourceId, Integer amenityId) {
        return toDto(findResourceAmenity(resourceId, amenityId));
    }

    @Override
    public ResourceAmenityDto updateResourceAmenity(Integer resourceId, Integer amenityId, ResourceAmenityRequestDto requestDto) {
        ResourceAmenity existing = findResourceAmenity(resourceId, amenityId);
        ResourceAmenityId currentId = existing.getId();
        ResourceAmenityId requestedId = toId(requestDto);

        validateDuplicate(requestedId, currentId);

        if (currentId.equals(requestedId)) {
            return toDto(existing);
        }

        resourceAmenityRepository.delete(existing);

        ResourceAmenity updated = ResourceAmenity.builder()
                .id(requestedId)
                .build();

        return toDto(resourceAmenityRepository.save(updated));
    }

    @Override
    public void deleteResourceAmenity(Integer resourceId, Integer amenityId) {
        ResourceAmenity resourceAmenity = findResourceAmenity(resourceId, amenityId);
        resourceAmenityRepository.delete(resourceAmenity);
    }

    private ResourceAmenity findResourceAmenity(Integer resourceId, Integer amenityId) {
        ResourceAmenityId id = new ResourceAmenityId(resourceId, amenityId);
        return resourceAmenityRepository.findById(id)
                .orElseThrow(() -> new ResourceAmenityNotFoundException(
                        "Resource amenity not found for resource id: " + resourceId + " and amenity id: " + amenityId
                ));
    }

    private void validateDuplicate(ResourceAmenityId requestedId, ResourceAmenityId currentId) {
        if (requestedId.equals(currentId)) {
            return;
        }

        boolean exists = resourceAmenityRepository.existsByIdResourceIdAndIdAmenityId(
                requestedId.getResourceId(),
                requestedId.getAmenityId()
        );

        if (exists) {
            throw new DuplicateResourceAmenityException(
                    "Resource amenity already exists for resource id: "
                            + requestedId.getResourceId()
                            + " and amenity id: "
                            + requestedId.getAmenityId()
            );
        }
    }

    private ResourceAmenityId toId(ResourceAmenityRequestDto requestDto) {
        return new ResourceAmenityId(requestDto.resourceId(), requestDto.amenityId());
    }

    private ResourceAmenityDto toDto(ResourceAmenity resourceAmenity) {
        return new ResourceAmenityDto(
                resourceAmenity.getId().getResourceId(),
                resourceAmenity.getId().getAmenityId()
        );
    }
}

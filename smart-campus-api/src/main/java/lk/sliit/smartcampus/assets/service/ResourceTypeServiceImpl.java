package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.ResourceTypeDto;
import lk.sliit.smartcampus.assets.dto.ResourceTypeRequestDto;
import lk.sliit.smartcampus.assets.entity.ResourceType;
import lk.sliit.smartcampus.assets.repository.ResourceTypeRepository;
import lk.sliit.smartcampus.common.exception.DuplicateResourceTypeCodeException;
import lk.sliit.smartcampus.common.exception.ResourceTypeNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResourceTypeServiceImpl implements ResourceTypeService {

    private final ResourceTypeRepository resourceTypeRepository;

    public ResourceTypeServiceImpl(ResourceTypeRepository resourceTypeRepository) {
        this.resourceTypeRepository = resourceTypeRepository;
    }

    @Override
    public ResourceTypeDto createResourceType(ResourceTypeRequestDto requestDto) {
        validateDuplicateCode(requestDto.typeCode(), null);

        ResourceType resourceType = ResourceType.builder()
                .typeCode(normalize(requestDto.typeCode()))
                .typeName(normalize(requestDto.typeName()))
                .description(normalizeNullable(requestDto.description()))
                .requiresCapacity(defaultTrue(requestDto.requiresCapacity()))
                .requiresLocation(defaultTrue(requestDto.requiresLocation()))
                .isEquipment(defaultFalse(requestDto.isEquipment()))
                .iconSlug(normalizeNullable(requestDto.iconSlug()))
                .build();

        return toDto(resourceTypeRepository.save(resourceType));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceTypeDto> getAllResourceTypes() {
        return resourceTypeRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceTypeDto getResourceTypeById(Integer id) {
        return toDto(findResourceType(id));
    }

    @Override
    public ResourceTypeDto updateResourceType(Integer id, ResourceTypeRequestDto requestDto) {
        ResourceType resourceType = findResourceType(id);
        validateDuplicateCode(requestDto.typeCode(), id);

        resourceType.setTypeCode(normalize(requestDto.typeCode()));
        resourceType.setTypeName(normalize(requestDto.typeName()));
        resourceType.setDescription(normalizeNullable(requestDto.description()));
        resourceType.setRequiresCapacity(defaultTrue(requestDto.requiresCapacity()));
        resourceType.setRequiresLocation(defaultTrue(requestDto.requiresLocation()));
        resourceType.setIsEquipment(defaultFalse(requestDto.isEquipment()));
        resourceType.setIconSlug(normalizeNullable(requestDto.iconSlug()));

        return toDto(resourceTypeRepository.save(resourceType));
    }

    @Override
    public void deleteResourceType(Integer id) {
        ResourceType resourceType = findResourceType(id);
        resourceTypeRepository.delete(resourceType);
    }

    private ResourceType findResourceType(Integer id) {
        return resourceTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceTypeNotFoundException("Resource type not found for id: " + id));
    }

    private void validateDuplicateCode(String typeCode, Integer id) {
        boolean exists = id == null
                ? resourceTypeRepository.existsByTypeCodeIgnoreCase(typeCode)
                : resourceTypeRepository.existsByTypeCodeIgnoreCaseAndIdNot(typeCode, id);

        if (exists) {
            throw new DuplicateResourceTypeCodeException("Resource type code already exists: " + typeCode);
        }
    }

    private ResourceTypeDto toDto(ResourceType resourceType) {
        return new ResourceTypeDto(
                resourceType.getId(),
                resourceType.getTypeCode(),
                resourceType.getTypeName(),
                resourceType.getDescription(),
                resourceType.getRequiresCapacity(),
                resourceType.getRequiresLocation(),
                resourceType.getIsEquipment(),
                resourceType.getIconSlug(),
                resourceType.getCreatedAt()
        );
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private Boolean defaultTrue(Boolean value) {
        return value == null ? Boolean.TRUE : value;
    }

    private Boolean defaultFalse(Boolean value) {
        return value == null ? Boolean.FALSE : value;
    }
}

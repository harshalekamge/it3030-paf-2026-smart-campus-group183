package lk.sliit.smartcampus.assets.service;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import lk.sliit.smartcampus.assets.dto.ResourceDto;
import lk.sliit.smartcampus.assets.dto.ResourceRequestDto;
import lk.sliit.smartcampus.assets.entity.Resource;
import lk.sliit.smartcampus.assets.repository.ResourceRepository;
import lk.sliit.smartcampus.common.exception.DuplicateResourceCodeException;
import lk.sliit.smartcampus.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private static final short DEFAULT_MIN_CAPACITY = 1;
    private static final String DEFAULT_STATUS = "ACTIVE";
    private static final short DEFAULT_MAX_BOOKING_DURATION = 240;
    private static final short DEFAULT_ADVANCE_BOOKING_DAYS = 30;
    private static final short DEFAULT_MIN_NOTICE_MINUTES = 60;
    private static final LocalTime DEFAULT_OPEN_TIME = LocalTime.of(8, 0);
    private static final LocalTime DEFAULT_CLOSE_TIME = LocalTime.of(18, 0);

    private final ResourceRepository resourceRepository;

    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    public ResourceDto createResource(ResourceRequestDto requestDto) {
        validateDuplicateCode(requestDto.code(), null);

        Resource resource = Resource.builder()
                .resourceTypeId(requestDto.resourceTypeId())
                .custodianId(requestDto.custodianId())
                .name(normalize(requestDto.name()))
                .code(normalize(requestDto.code()))
                .description(normalizeNullable(requestDto.description()))
                .tags(normalizeTags(requestDto.tags()))
                .building(normalizeNullable(requestDto.building()))
                .floor(requestDto.floor())
                .roomNo(normalizeNullable(requestDto.roomNo()))
                .capacity(requestDto.capacity())
                .minCapacity(defaultMinCapacity(requestDto.minCapacity()))
                .status(normalizeStatus(requestDto.status()))
                .isActive(defaultTrue(requestDto.isActive()))
                .purchaseDate(requestDto.purchaseDate())
                .lastServicedAt(requestDto.lastServicedAt())
                .nextServiceDue(requestDto.nextServiceDue())
                .replacementCost(requestDto.replacementCost())
                .maxBookingDuration(defaultMaxBookingDuration(requestDto.maxBookingDuration()))
                .advanceBookingDays(defaultAdvanceBookingDays(requestDto.advanceBookingDays()))
                .requiresApproval(defaultFalse(requestDto.requiresApproval()))
                .minNoticeMinutes(defaultMinNoticeMinutes(requestDto.minNoticeMinutes()))
                .defaultOpenTime(defaultOpenTime(requestDto.defaultOpenTime()))
                .defaultCloseTime(defaultCloseTime(requestDto.defaultCloseTime()))
                .isAccessible(defaultFalse(requestDto.isAccessible()))
                .accessibilityNotes(normalizeNullable(requestDto.accessibilityNotes()))
                .primaryImageUrl(normalizeNullable(requestDto.primaryImageUrl()))
                .build();

        return toDto(resourceRepository.save(resource));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceDto> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceDto getResourceById(Integer id) {
        return toDto(findResource(id));
    }

    @Override
    public ResourceDto updateResource(Integer id, ResourceRequestDto requestDto) {
        Resource resource = findResource(id);
        validateDuplicateCode(requestDto.code(), id);

        resource.setResourceTypeId(requestDto.resourceTypeId());
        resource.setCustodianId(requestDto.custodianId());
        resource.setName(normalize(requestDto.name()));
        resource.setCode(normalize(requestDto.code()));
        resource.setDescription(normalizeNullable(requestDto.description()));
        resource.setTags(normalizeTags(requestDto.tags()));
        resource.setBuilding(normalizeNullable(requestDto.building()));
        resource.setFloor(requestDto.floor());
        resource.setRoomNo(normalizeNullable(requestDto.roomNo()));
        resource.setCapacity(requestDto.capacity());
        resource.setMinCapacity(defaultMinCapacity(requestDto.minCapacity()));
        resource.setStatus(normalizeStatus(requestDto.status()));
        resource.setIsActive(defaultTrue(requestDto.isActive()));
        resource.setPurchaseDate(requestDto.purchaseDate());
        resource.setLastServicedAt(requestDto.lastServicedAt());
        resource.setNextServiceDue(requestDto.nextServiceDue());
        resource.setReplacementCost(requestDto.replacementCost());
        resource.setMaxBookingDuration(defaultMaxBookingDuration(requestDto.maxBookingDuration()));
        resource.setAdvanceBookingDays(defaultAdvanceBookingDays(requestDto.advanceBookingDays()));
        resource.setRequiresApproval(defaultFalse(requestDto.requiresApproval()));
        resource.setMinNoticeMinutes(defaultMinNoticeMinutes(requestDto.minNoticeMinutes()));
        resource.setDefaultOpenTime(defaultOpenTime(requestDto.defaultOpenTime()));
        resource.setDefaultCloseTime(defaultCloseTime(requestDto.defaultCloseTime()));
        resource.setIsAccessible(defaultFalse(requestDto.isAccessible()));
        resource.setAccessibilityNotes(normalizeNullable(requestDto.accessibilityNotes()));
        resource.setPrimaryImageUrl(normalizeNullable(requestDto.primaryImageUrl()));

        return toDto(resourceRepository.save(resource));
    }

    @Override
    public void deleteResource(Integer id) {
        Resource resource = findResource(id);
        resourceRepository.delete(resource);
    }

    private Resource findResource(Integer id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found for id: " + id));
    }

    private void validateDuplicateCode(String code, Integer id) {
        boolean exists = id == null
                ? resourceRepository.existsByCodeIgnoreCase(code)
                : resourceRepository.existsByCodeIgnoreCaseAndIdNot(code, id);

        if (exists) {
            throw new DuplicateResourceCodeException("Resource code already exists: " + code);
        }
    }

    private ResourceDto toDto(Resource resource) {
        return new ResourceDto(
                resource.getId(),
                resource.getResourceTypeId(),
                resource.getCustodianId(),
                resource.getName(),
                resource.getCode(),
                resource.getDescription(),
                resource.getTags() == null ? null : Arrays.asList(resource.getTags()),
                resource.getBuilding(),
                resource.getFloor(),
                resource.getRoomNo(),
                resource.getCapacity(),
                resource.getMinCapacity(),
                resource.getStatus(),
                resource.getIsActive(),
                resource.getPurchaseDate(),
                resource.getLastServicedAt(),
                resource.getNextServiceDue(),
                resource.getReplacementCost(),
                resource.getMaxBookingDuration(),
                resource.getAdvanceBookingDays(),
                resource.getRequiresApproval(),
                resource.getMinNoticeMinutes(),
                resource.getDefaultOpenTime(),
                resource.getDefaultCloseTime(),
                resource.getIsAccessible(),
                resource.getAccessibilityNotes(),
                resource.getPrimaryImageUrl(),
                resource.getCreatedAt(),
                resource.getUpdatedAt()
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

    private String[] normalizeTags(List<String> tags) {
        if (tags == null) {
            return null;
        }

        List<String> normalized = tags.stream()
                .map(this::normalizeNullable)
                .filter(tag -> tag != null)
                .toList();

        return normalized.isEmpty() ? null : normalized.toArray(String[]::new);
    }

    private String normalizeStatus(String value) {
        String normalized = normalizeNullable(value);
        return normalized == null ? DEFAULT_STATUS : normalized.toUpperCase();
    }

    private Short defaultMinCapacity(Short value) {
        return value == null ? DEFAULT_MIN_CAPACITY : value;
    }

    private Boolean defaultTrue(Boolean value) {
        return value == null ? true : value;
    }

    private Boolean defaultFalse(Boolean value) {
        return value == null ? false : value;
    }

    private Short defaultMaxBookingDuration(Short value) {
        return value == null ? DEFAULT_MAX_BOOKING_DURATION : value;
    }

    private Short defaultAdvanceBookingDays(Short value) {
        return value == null ? DEFAULT_ADVANCE_BOOKING_DAYS : value;
    }

    private Short defaultMinNoticeMinutes(Short value) {
        return value == null ? DEFAULT_MIN_NOTICE_MINUTES : value;
    }

    private LocalTime defaultOpenTime(LocalTime value) {
        return value == null ? DEFAULT_OPEN_TIME : value;
    }

    private LocalTime defaultCloseTime(LocalTime value) {
        return value == null ? DEFAULT_CLOSE_TIME : value;
    }
}

package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.ResourceMediaDto;
import lk.sliit.smartcampus.assets.dto.ResourceMediaRequestDto;
import lk.sliit.smartcampus.assets.entity.ResourceMedia;
import lk.sliit.smartcampus.assets.repository.ResourceMediaRepository;
import lk.sliit.smartcampus.common.exception.ResourceMediaNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResourceMediaServiceImpl implements ResourceMediaService {

    private static final String DEFAULT_MEDIA_TYPE = "IMAGE";
    private static final short DEFAULT_DISPLAY_ORDER = 0;

    private final ResourceMediaRepository resourceMediaRepository;

    public ResourceMediaServiceImpl(ResourceMediaRepository resourceMediaRepository) {
        this.resourceMediaRepository = resourceMediaRepository;
    }

    @Override
    public ResourceMediaDto createResourceMedia(ResourceMediaRequestDto requestDto) {
        ResourceMedia resourceMedia = ResourceMedia.builder()
                .resourceId(requestDto.resourceId())
                .url(normalize(requestDto.url()))
                .mediaType(normalizeMediaType(requestDto.mediaType()))
                .caption(normalizeNullable(requestDto.caption()))
                .isPrimary(defaultBoolean(requestDto.isPrimary()))
                .displayOrder(defaultDisplayOrder(requestDto.displayOrder()))
                .build();

        return toDto(resourceMediaRepository.save(resourceMedia));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceMediaDto> getAllResourceMedia() {
        return resourceMediaRepository.findAllByOrderByDisplayOrderAscIdAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceMediaDto getResourceMediaById(Integer id) {
        return toDto(findResourceMedia(id));
    }

    @Override
    public ResourceMediaDto updateResourceMedia(Integer id, ResourceMediaRequestDto requestDto) {
        ResourceMedia resourceMedia = findResourceMedia(id);

        resourceMedia.setResourceId(requestDto.resourceId());
        resourceMedia.setUrl(normalize(requestDto.url()));
        resourceMedia.setMediaType(normalizeMediaType(requestDto.mediaType()));
        resourceMedia.setCaption(normalizeNullable(requestDto.caption()));
        resourceMedia.setIsPrimary(defaultBoolean(requestDto.isPrimary()));
        resourceMedia.setDisplayOrder(defaultDisplayOrder(requestDto.displayOrder()));

        return toDto(resourceMediaRepository.save(resourceMedia));
    }

    @Override
    public void deleteResourceMedia(Integer id) {
        ResourceMedia resourceMedia = findResourceMedia(id);
        resourceMediaRepository.delete(resourceMedia);
    }

    private ResourceMedia findResourceMedia(Integer id) {
        return resourceMediaRepository.findById(id)
                .orElseThrow(() -> new ResourceMediaNotFoundException("Resource media not found for id: " + id));
    }

    private ResourceMediaDto toDto(ResourceMedia resourceMedia) {
        return new ResourceMediaDto(
                resourceMedia.getId(),
                resourceMedia.getResourceId(),
                resourceMedia.getUrl(),
                resourceMedia.getMediaType(),
                resourceMedia.getCaption(),
                resourceMedia.getIsPrimary(),
                resourceMedia.getDisplayOrder(),
                resourceMedia.getUploadedAt()
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

    private String normalizeMediaType(String value) {
        String normalized = normalizeNullable(value);
        return normalized == null ? DEFAULT_MEDIA_TYPE : normalized.toUpperCase();
    }

    private Boolean defaultBoolean(Boolean value) {
        return value == null ? false : value;
    }

    private Short defaultDisplayOrder(Short value) {
        return value == null ? DEFAULT_DISPLAY_ORDER : value;
    }
}

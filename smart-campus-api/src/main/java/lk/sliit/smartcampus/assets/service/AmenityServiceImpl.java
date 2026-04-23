package lk.sliit.smartcampus.assets.service;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.AmenityDto;
import lk.sliit.smartcampus.assets.dto.AmenityRequestDto;
import lk.sliit.smartcampus.assets.entity.Amenity;
import lk.sliit.smartcampus.assets.repository.AmenityRepository;
import lk.sliit.smartcampus.common.exception.AmenityNotFoundException;
import lk.sliit.smartcampus.common.exception.DuplicateAmenityCodeException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AmenityServiceImpl implements AmenityService {

    private final AmenityRepository amenityRepository;

    public AmenityServiceImpl(AmenityRepository amenityRepository) {
        this.amenityRepository = amenityRepository;
    }

    @Override
    public AmenityDto createAmenity(AmenityRequestDto requestDto) {
        validateDuplicateCode(requestDto.code(), null);

        Amenity amenity = Amenity.builder()
                .code(normalize(requestDto.code()))
                .label(normalize(requestDto.label()))
                .iconSlug(normalizeNullable(requestDto.iconSlug()))
                .build();

        return toDto(amenityRepository.save(amenity));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AmenityDto> getAllAmenities() {
        return amenityRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AmenityDto getAmenityById(Integer id) {
        return toDto(findAmenity(id));
    }

    @Override
    public AmenityDto updateAmenity(Integer id, AmenityRequestDto requestDto) {
        Amenity amenity = findAmenity(id);
        validateDuplicateCode(requestDto.code(), id);

        amenity.setCode(normalize(requestDto.code()));
        amenity.setLabel(normalize(requestDto.label()));
        amenity.setIconSlug(normalizeNullable(requestDto.iconSlug()));

        return toDto(amenityRepository.save(amenity));
    }

    @Override
    public void deleteAmenity(Integer id) {
        Amenity amenity = findAmenity(id);
        amenityRepository.delete(amenity);
    }

    private Amenity findAmenity(Integer id) {
        return amenityRepository.findById(id)
                .orElseThrow(() -> new AmenityNotFoundException("Amenity not found for id: " + id));
    }

    private void validateDuplicateCode(String code, Integer id) {
        boolean exists = id == null
                ? amenityRepository.existsByCodeIgnoreCase(code)
                : amenityRepository.existsByCodeIgnoreCaseAndIdNot(code, id);

        if (exists) {
            throw new DuplicateAmenityCodeException("Amenity code already exists: " + code);
        }
    }

    private AmenityDto toDto(Amenity amenity) {
        return new AmenityDto(
                amenity.getId(),
                amenity.getCode(),
                amenity.getLabel(),
                amenity.getIconSlug()
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
}

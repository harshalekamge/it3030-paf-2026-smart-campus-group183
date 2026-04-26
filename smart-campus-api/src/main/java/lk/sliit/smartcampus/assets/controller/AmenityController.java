package lk.sliit.smartcampus.assets.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import lk.sliit.smartcampus.assets.dto.AmenityDto;
import lk.sliit.smartcampus.assets.dto.AmenityRequestDto;
import lk.sliit.smartcampus.assets.service.AmenityService;
import lk.sliit.smartcampus.common.response.ApiResponse;
import lk.sliit.smartcampus.common.web.WebCacheService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/amenities")
public class AmenityController {

    private static final long CACHE_MAX_AGE_SECONDS = 300;

    private final AmenityService amenityService;
    private final WebCacheService webCacheService;

    public AmenityController(AmenityService amenityService, WebCacheService webCacheService) {
        this.amenityService = amenityService;
        this.webCacheService = webCacheService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AmenityDto>> createAmenity(@Valid @RequestBody AmenityRequestDto requestDto) {
        AmenityDto amenity = amenityService.createAmenity(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Amenity created successfully", amenity));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AmenityDto>>> getAllAmenities(HttpServletRequest request) {
        List<AmenityDto> amenities = amenityService.getAllAmenities();
        String etag = webCacheService.buildEtag(amenities);

        if (webCacheService.isNotModified(request, etag)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .cacheControl(webCacheService.privateCachePolicy(CACHE_MAX_AGE_SECONDS))
                    .eTag(etag)
                    .build();
        }

        return ResponseEntity.ok()
                .cacheControl(webCacheService.privateCachePolicy(CACHE_MAX_AGE_SECONDS))
                .eTag(etag)
                .body(ApiResponse.success("Amenities retrieved successfully", amenities));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AmenityDto>> getAmenityById(@PathVariable Integer id, HttpServletRequest request) {
        AmenityDto amenity = amenityService.getAmenityById(id);
        String etag = webCacheService.buildEtag(amenity);

        if (webCacheService.isNotModified(request, etag)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .cacheControl(webCacheService.privateCachePolicy(CACHE_MAX_AGE_SECONDS))
                    .eTag(etag)
                    .build();
        }

        return ResponseEntity.ok()
                .cacheControl(webCacheService.privateCachePolicy(CACHE_MAX_AGE_SECONDS))
                .eTag(etag)
                .body(ApiResponse.success("Amenity retrieved successfully", amenity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AmenityDto>> updateAmenity(
            @PathVariable Integer id,
            @Valid @RequestBody AmenityRequestDto requestDto
    ) {
        return ResponseEntity.ok(ApiResponse.success("Amenity updated successfully", amenityService.updateAmenity(id, requestDto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAmenity(@PathVariable Integer id) {
        amenityService.deleteAmenity(id);
        return ResponseEntity.noContent().build();
    }
}

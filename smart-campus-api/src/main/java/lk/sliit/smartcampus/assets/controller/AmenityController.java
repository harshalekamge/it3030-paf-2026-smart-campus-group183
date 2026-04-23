package lk.sliit.smartcampus.assets.controller;

import java.util.List;

import lk.sliit.smartcampus.assets.dto.AmenityDto;
import lk.sliit.smartcampus.assets.dto.AmenityRequestDto;
import lk.sliit.smartcampus.assets.service.AmenityService;
import lk.sliit.smartcampus.common.response.ApiResponse;
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

    private final AmenityService amenityService;

    public AmenityController(AmenityService amenityService) {
        this.amenityService = amenityService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AmenityDto>> createAmenity(@Valid @RequestBody AmenityRequestDto requestDto) {
        AmenityDto amenity = amenityService.createAmenity(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Amenity created successfully", amenity));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AmenityDto>>> getAllAmenities() {
        return ResponseEntity.ok(ApiResponse.success("Amenities retrieved successfully", amenityService.getAllAmenities()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AmenityDto>> getAmenityById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success("Amenity retrieved successfully", amenityService.getAmenityById(id)));
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

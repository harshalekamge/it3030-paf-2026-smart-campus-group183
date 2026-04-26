package lk.sliit.smartcampus.assets.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lk.sliit.smartcampus.assets.dto.ResourceAmenityDto;
import lk.sliit.smartcampus.assets.dto.ResourceAmenityRequestDto;
import lk.sliit.smartcampus.assets.service.ResourceAmenityService;
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
@RequestMapping("/resource-amenities")
@Tag(name = "Resource Amenities", description = "CRUD APIs for assigning amenities to resources")
public class ResourceAmenityController {

    private final ResourceAmenityService resourceAmenityService;

    public ResourceAmenityController(ResourceAmenityService resourceAmenityService) {
        this.resourceAmenityService = resourceAmenityService;
    }

    @PostMapping
    @Operation(summary = "Create a resource amenity mapping", description = "Creates a new resource to amenity association")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Resource amenity created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "409", description = "Duplicate resource amenity", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceAmenityDto>> createResourceAmenity(
            @Valid @RequestBody ResourceAmenityRequestDto requestDto
    ) {
        ResourceAmenityDto resourceAmenity = resourceAmenityService.createResourceAmenity(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lk.sliit.smartcampus.common.response.ApiResponse.success("Resource amenity created successfully", resourceAmenity));
    }

    @GetMapping
    @Operation(summary = "Get all resource amenity mappings", description = "Retrieves all resource to amenity associations")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource amenities retrieved successfully")
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<List<ResourceAmenityDto>>> getAllResourceAmenities() {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Resource amenities retrieved successfully",
                        resourceAmenityService.getAllResourceAmenities()
                )
        );
    }

    @GetMapping("/{resourceId}/{amenityId}")
    @Operation(summary = "Get resource amenity mapping by composite key", description = "Retrieves a single resource amenity association by resource id and amenity id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource amenity retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Resource amenity not found", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceAmenityDto>> getResourceAmenityById(
            @Parameter(description = "Resource id", example = "1")
            @PathVariable Integer resourceId,
            @Parameter(description = "Amenity id", example = "2")
            @PathVariable Integer amenityId
    ) {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Resource amenity retrieved successfully",
                        resourceAmenityService.getResourceAmenityById(resourceId, amenityId)
                )
        );
    }

    @PutMapping("/{resourceId}/{amenityId}")
    @Operation(summary = "Update a resource amenity mapping", description = "Updates an existing resource to amenity association")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource amenity updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "404", description = "Resource amenity not found", content = @Content),
            @ApiResponse(responseCode = "409", description = "Duplicate resource amenity", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceAmenityDto>> updateResourceAmenity(
            @Parameter(description = "Current resource id", example = "1")
            @PathVariable Integer resourceId,
            @Parameter(description = "Current amenity id", example = "2")
            @PathVariable Integer amenityId,
            @Valid @RequestBody ResourceAmenityRequestDto requestDto
    ) {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Resource amenity updated successfully",
                        resourceAmenityService.updateResourceAmenity(resourceId, amenityId, requestDto)
                )
        );
    }

    @DeleteMapping("/{resourceId}/{amenityId}")
    @Operation(summary = "Delete a resource amenity mapping", description = "Deletes a resource to amenity association")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Resource amenity deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Resource amenity not found", content = @Content)
    })
    public ResponseEntity<Void> deleteResourceAmenity(
            @Parameter(description = "Resource id", example = "1")
            @PathVariable Integer resourceId,
            @Parameter(description = "Amenity id", example = "2")
            @PathVariable Integer amenityId
    ) {
        resourceAmenityService.deleteResourceAmenity(resourceId, amenityId);
        return ResponseEntity.noContent().build();
    }
}

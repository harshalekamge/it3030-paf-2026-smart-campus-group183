package lk.sliit.smartcampus.assets.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lk.sliit.smartcampus.assets.dto.ResourceTypeDto;
import lk.sliit.smartcampus.assets.dto.ResourceTypeRequestDto;
import lk.sliit.smartcampus.assets.service.ResourceTypeService;
import jakarta.validation.Valid;
import lk.sliit.smartcampus.common.web.WebCacheService;
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
@RequestMapping("/resource-types")
@Tag(name = "Resource Types", description = "CRUD APIs for assets resource type management")
public class ResourceTypeController {

    private static final long CACHE_MAX_AGE_SECONDS = 300;

    private final ResourceTypeService resourceTypeService;
    private final WebCacheService webCacheService;

    public ResourceTypeController(ResourceTypeService resourceTypeService, WebCacheService webCacheService) {
        this.resourceTypeService = resourceTypeService;
        this.webCacheService = webCacheService;
    }

    @PostMapping
    @Operation(summary = "Create a resource type", description = "Creates a new resource type in the assets schema")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Resource type created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "409", description = "Duplicate resource type code", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceTypeDto>> createResourceType(
            @Valid @RequestBody ResourceTypeRequestDto requestDto
    ) {
        ResourceTypeDto resourceType = resourceTypeService.createResourceType(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lk.sliit.smartcampus.common.response.ApiResponse.success("Resource type created successfully", resourceType));
    }

    @GetMapping
    @Operation(summary = "Get all resource types", description = "Retrieves all resource types from the assets schema")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource types retrieved successfully")
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<List<ResourceTypeDto>>> getAllResourceTypes(
            HttpServletRequest request
    ) {
        List<ResourceTypeDto> resourceTypes = resourceTypeService.getAllResourceTypes();
        String etag = webCacheService.buildEtag(resourceTypes);

        if (webCacheService.isNotModified(request, etag)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .cacheControl(webCacheService.privateCachePolicy(CACHE_MAX_AGE_SECONDS))
                    .eTag(etag)
                    .build();
        }

        return ResponseEntity.ok()
                .cacheControl(webCacheService.privateCachePolicy(CACHE_MAX_AGE_SECONDS))
                .eTag(etag)
                .body(
                        lk.sliit.smartcampus.common.response.ApiResponse.success(
                                "Resource types retrieved successfully",
                                resourceTypes
                        )
                );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resource type by id", description = "Retrieves a single resource type by its database id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource type retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Resource type not found", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceTypeDto>> getResourceTypeById(
            @Parameter(description = "Resource type id", example = "1")
            @PathVariable Integer id,
            HttpServletRequest request
    ) {
        ResourceTypeDto resourceType = resourceTypeService.getResourceTypeById(id);
        String etag = webCacheService.buildEtag(resourceType);

        if (webCacheService.isNotModified(request, etag)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .cacheControl(webCacheService.privateCachePolicy(CACHE_MAX_AGE_SECONDS))
                    .eTag(etag)
                    .build();
        }

        return ResponseEntity.ok()
                .cacheControl(webCacheService.privateCachePolicy(CACHE_MAX_AGE_SECONDS))
                .eTag(etag)
                .body(
                        lk.sliit.smartcampus.common.response.ApiResponse.success(
                                "Resource type retrieved successfully",
                                resourceType
                        )
                );
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a resource type", description = "Updates an existing resource type by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource type updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "404", description = "Resource type not found", content = @Content),
            @ApiResponse(responseCode = "409", description = "Duplicate resource type code", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceTypeDto>> updateResourceType(
            @Parameter(description = "Resource type id", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody ResourceTypeRequestDto requestDto
    ) {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Resource type updated successfully",
                        resourceTypeService.updateResourceType(id, requestDto)
                )
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a resource type", description = "Deletes a resource type by id")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Resource type deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Resource type not found", content = @Content)
    })
    public ResponseEntity<Void> deleteResourceType(
            @Parameter(description = "Resource type id", example = "1")
            @PathVariable Integer id
    ) {
        resourceTypeService.deleteResourceType(id);
        return ResponseEntity.noContent().build();
    }
}

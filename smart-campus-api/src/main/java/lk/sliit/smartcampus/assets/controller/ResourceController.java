package lk.sliit.smartcampus.assets.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lk.sliit.smartcampus.assets.dto.ResourceDto;
import lk.sliit.smartcampus.assets.dto.ResourceRequestDto;
import lk.sliit.smartcampus.assets.service.ResourceService;
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
@RequestMapping("/resources")
@Tag(name = "Resources", description = "CRUD APIs for assets resource management")
public class ResourceController {

    private static final long CACHE_MAX_AGE_SECONDS = 120;

    private final ResourceService resourceService;
    private final WebCacheService webCacheService;

    public ResourceController(ResourceService resourceService, WebCacheService webCacheService) {
        this.resourceService = resourceService;
        this.webCacheService = webCacheService;
    }

    @PostMapping
    @Operation(summary = "Create a resource", description = "Creates a new resource in the assets schema")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Resource created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "409", description = "Duplicate resource code", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceDto>> createResource(
            @Valid @RequestBody ResourceRequestDto requestDto
    ) {
        ResourceDto resource = resourceService.createResource(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lk.sliit.smartcampus.common.response.ApiResponse.success("Resource created successfully", resource));
    }

    @GetMapping
    @Operation(summary = "Get all resources", description = "Retrieves all resources from the assets schema")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resources retrieved successfully")
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<List<ResourceDto>>> getAllResources(
            HttpServletRequest request
    ) {
        List<ResourceDto> resources = resourceService.getAllResources();
        String etag = webCacheService.buildEtag(resources);

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
                                "Resources retrieved successfully",
                                resources
                        )
                );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resource by id", description = "Retrieves a single resource by its database id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Resource not found", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceDto>> getResourceById(
            @Parameter(description = "Resource id", example = "1")
            @PathVariable Integer id,
            HttpServletRequest request
    ) {
        ResourceDto resource = resourceService.getResourceById(id);
        String etag = webCacheService.buildEtag(resource);

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
                                "Resource retrieved successfully",
                                resource
                        )
                );
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a resource", description = "Updates an existing resource by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "404", description = "Resource not found", content = @Content),
            @ApiResponse(responseCode = "409", description = "Duplicate resource code", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceDto>> updateResource(
            @Parameter(description = "Resource id", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody ResourceRequestDto requestDto
    ) {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Resource updated successfully",
                        resourceService.updateResource(id, requestDto)
                )
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a resource", description = "Deletes a resource by id")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Resource deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Resource not found", content = @Content)
    })
    public ResponseEntity<Void> deleteResource(
            @Parameter(description = "Resource id", example = "1")
            @PathVariable Integer id
    ) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}

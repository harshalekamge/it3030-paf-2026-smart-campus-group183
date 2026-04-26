package lk.sliit.smartcampus.assets.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lk.sliit.smartcampus.assets.dto.ResourceMediaDto;
import lk.sliit.smartcampus.assets.dto.ResourceMediaRequestDto;
import lk.sliit.smartcampus.assets.service.ResourceMediaService;
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
@RequestMapping("/resource-media")
@Tag(name = "Resource Media", description = "CRUD APIs for assets resource media management")
public class ResourceMediaController {

    private final ResourceMediaService resourceMediaService;

    public ResourceMediaController(ResourceMediaService resourceMediaService) {
        this.resourceMediaService = resourceMediaService;
    }

    @PostMapping
    @Operation(summary = "Create resource media", description = "Creates a new media record for a resource in the assets schema")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Resource media created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceMediaDto>> createResourceMedia(
            @Valid @RequestBody ResourceMediaRequestDto requestDto
    ) {
        ResourceMediaDto resourceMedia = resourceMediaService.createResourceMedia(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lk.sliit.smartcampus.common.response.ApiResponse.success("Resource media created successfully", resourceMedia));
    }

    @GetMapping
    @Operation(summary = "Get all resource media", description = "Retrieves all resource media records from the assets schema")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource media retrieved successfully")
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<List<ResourceMediaDto>>> getAllResourceMedia() {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Resource media retrieved successfully",
                        resourceMediaService.getAllResourceMedia()
                )
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resource media by id", description = "Retrieves a single resource media record by its database id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource media retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Resource media not found", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceMediaDto>> getResourceMediaById(
            @Parameter(description = "Resource media id", example = "1")
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Resource media retrieved successfully",
                        resourceMediaService.getResourceMediaById(id)
                )
        );
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update resource media", description = "Updates an existing resource media record by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource media updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "404", description = "Resource media not found", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<ResourceMediaDto>> updateResourceMedia(
            @Parameter(description = "Resource media id", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody ResourceMediaRequestDto requestDto
    ) {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Resource media updated successfully",
                        resourceMediaService.updateResourceMedia(id, requestDto)
                )
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete resource media", description = "Deletes a resource media record by id")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Resource media deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Resource media not found", content = @Content)
    })
    public ResponseEntity<Void> deleteResourceMedia(
            @Parameter(description = "Resource media id", example = "1")
            @PathVariable Integer id
    ) {
        resourceMediaService.deleteResourceMedia(id);
        return ResponseEntity.noContent().build();
    }
}

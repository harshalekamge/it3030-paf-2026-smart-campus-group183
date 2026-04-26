package lk.sliit.smartcampus.assets.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lk.sliit.smartcampus.assets.dto.AvailabilityWindowDto;
import lk.sliit.smartcampus.assets.dto.AvailabilityWindowRequestDto;
import lk.sliit.smartcampus.assets.service.AvailabilityWindowService;
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
@RequestMapping("/availability-windows")
@Tag(name = "Availability Windows", description = "CRUD APIs for assets availability window management")
public class AvailabilityWindowController {

    private final AvailabilityWindowService availabilityWindowService;

    public AvailabilityWindowController(AvailabilityWindowService availabilityWindowService) {
        this.availabilityWindowService = availabilityWindowService;
    }

    @PostMapping
    @Operation(summary = "Create availability window", description = "Creates a new availability window in the assets schema")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Availability window created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<AvailabilityWindowDto>> createAvailabilityWindow(
            @Valid @RequestBody AvailabilityWindowRequestDto requestDto
    ) {
        AvailabilityWindowDto availabilityWindow = availabilityWindowService.createAvailabilityWindow(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lk.sliit.smartcampus.common.response.ApiResponse.success("Availability window created successfully", availabilityWindow));
    }

    @GetMapping
    @Operation(summary = "Get all availability windows", description = "Retrieves all availability windows from the assets schema")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Availability windows retrieved successfully")
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<List<AvailabilityWindowDto>>> getAllAvailabilityWindows() {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Availability windows retrieved successfully",
                        availabilityWindowService.getAllAvailabilityWindows()
                )
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get availability window by id", description = "Retrieves a single availability window by its database id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Availability window retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Availability window not found", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<AvailabilityWindowDto>> getAvailabilityWindowById(
            @Parameter(description = "Availability window id", example = "1")
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Availability window retrieved successfully",
                        availabilityWindowService.getAvailabilityWindowById(id)
                )
        );
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update availability window", description = "Updates an existing availability window by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Availability window updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "404", description = "Availability window not found", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<AvailabilityWindowDto>> updateAvailabilityWindow(
            @Parameter(description = "Availability window id", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody AvailabilityWindowRequestDto requestDto
    ) {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Availability window updated successfully",
                        availabilityWindowService.updateAvailabilityWindow(id, requestDto)
                )
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete availability window", description = "Deletes an availability window by id")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Availability window deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Availability window not found", content = @Content)
    })
    public ResponseEntity<Void> deleteAvailabilityWindow(
            @Parameter(description = "Availability window id", example = "1")
            @PathVariable Integer id
    ) {
        availabilityWindowService.deleteAvailabilityWindow(id);
        return ResponseEntity.noContent().build();
    }
}

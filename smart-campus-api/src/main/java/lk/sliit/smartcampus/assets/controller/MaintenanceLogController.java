package lk.sliit.smartcampus.assets.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lk.sliit.smartcampus.assets.dto.MaintenanceLogDto;
import lk.sliit.smartcampus.assets.dto.MaintenanceLogRequestDto;
import lk.sliit.smartcampus.assets.service.MaintenanceLogService;
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
@RequestMapping("/maintenance-logs")
@Tag(name = "Maintenance Logs", description = "CRUD APIs for assets maintenance log management")
public class MaintenanceLogController {

    private final MaintenanceLogService maintenanceLogService;

    public MaintenanceLogController(MaintenanceLogService maintenanceLogService) {
        this.maintenanceLogService = maintenanceLogService;
    }

    @PostMapping
    @Operation(summary = "Create maintenance log", description = "Creates a new maintenance log in the assets schema")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Maintenance log created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<MaintenanceLogDto>> createMaintenanceLog(
            @Valid @RequestBody MaintenanceLogRequestDto requestDto
    ) {
        MaintenanceLogDto maintenanceLog = maintenanceLogService.createMaintenanceLog(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lk.sliit.smartcampus.common.response.ApiResponse.success("Maintenance log created successfully", maintenanceLog));
    }

    @GetMapping
    @Operation(summary = "Get all maintenance logs", description = "Retrieves all maintenance logs from the assets schema")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Maintenance logs retrieved successfully")
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<List<MaintenanceLogDto>>> getAllMaintenanceLogs() {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Maintenance logs retrieved successfully",
                        maintenanceLogService.getAllMaintenanceLogs()
                )
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get maintenance log by id", description = "Retrieves a single maintenance log by its database id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Maintenance log retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Maintenance log not found", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<MaintenanceLogDto>> getMaintenanceLogById(
            @Parameter(description = "Maintenance log id", example = "1")
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Maintenance log retrieved successfully",
                        maintenanceLogService.getMaintenanceLogById(id)
                )
        );
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update maintenance log", description = "Updates an existing maintenance log by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Maintenance log updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content),
            @ApiResponse(responseCode = "404", description = "Maintenance log not found", content = @Content)
    })
    public ResponseEntity<lk.sliit.smartcampus.common.response.ApiResponse<MaintenanceLogDto>> updateMaintenanceLog(
            @Parameter(description = "Maintenance log id", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody MaintenanceLogRequestDto requestDto
    ) {
        return ResponseEntity.ok(
                lk.sliit.smartcampus.common.response.ApiResponse.success(
                        "Maintenance log updated successfully",
                        maintenanceLogService.updateMaintenanceLog(id, requestDto)
                )
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete maintenance log", description = "Deletes a maintenance log by id")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Maintenance log deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Maintenance log not found", content = @Content)
    })
    public ResponseEntity<Void> deleteMaintenanceLog(
            @Parameter(description = "Maintenance log id", example = "1")
            @PathVariable Integer id
    ) {
        maintenanceLogService.deleteMaintenanceLog(id);
        return ResponseEntity.noContent().build();
    }
}

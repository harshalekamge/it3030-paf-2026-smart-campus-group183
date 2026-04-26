package lk.sliit.smartcampus.common.web;

import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/client-scripts")
public class ClientScriptController {

    @GetMapping(value = "/resource-summary.js", produces = "application/javascript")
    public ResponseEntity<String> getResourceSummaryScript() {
        String script = """
                export function buildResourceInsight(input) {
                  const resource = input.resource ?? {};
                  const resourceType = input.resourceType ?? {};
                  const amenities = input.assignedAmenities ?? [];
                  const maintenanceLogs = input.maintenanceLogs ?? [];
                  const availabilityWindows = input.availabilityWindows ?? [];
                  const mediaItems = input.mediaItems ?? [];

                  const score =
                    (resource.isActive ? 30 : 10) +
                    Math.min(amenities.length, 5) * 8 +
                    Math.min(availabilityWindows.length, 5) * 6 +
                    Math.min(mediaItems.length, 4) * 4 -
                    Math.min(maintenanceLogs.length, 3) * 5;

                  const readinessScore = Math.max(0, Math.min(100, score));
                  const bookingMode = resource.requiresApproval ? "approval-required" : "self-service";
                  const headline = `${resource.name ?? "Resource"} is ${resource.isActive ? "live" : "inactive"} with a readiness score of ${readinessScore}/100.`;
                  const highlights = [
                    `${amenities.length} amenity assignments support the user experience.`,
                    `${availabilityWindows.length} availability windows define bookable access.`,
                    `${maintenanceLogs.length} maintenance records are linked for audit visibility.`,
                    `${mediaItems.length} media item(s) are available for preview and documentation.`,
                  ];

                  return {
                    headline,
                    readinessScore,
                    bookingMode,
                    resourceTypeName: resourceType.typeName ?? "Not assigned",
                    highlights,
                  };
                }
                """;

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/javascript"))
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .body(script);
    }
}

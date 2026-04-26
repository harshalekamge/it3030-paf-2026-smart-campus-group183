package lk.sliit.smartcampus.assets.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "maintenance_log", schema = "assets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "resource_id", nullable = false)
    private Integer resourceId;

    @Column(name = "reported_by")
    private Integer reportedBy;

    @Column(name = "prior_status", length = 25)
    private String priorStatus;

    @Column(name = "new_status", length = 25)
    private String newStatus;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "description")
    private String description;

    @Column(name = "started_at", insertable = false, updatable = false)
    private OffsetDateTime startedAt;

    @Column(name = "resolved_at")
    private OffsetDateTime resolvedAt;

    @Column(name = "cost", precision = 10, scale = 2)
    private BigDecimal cost;

    @Column(name = "external_ref", length = 100)
    private String externalRef;
}

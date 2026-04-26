package lk.sliit.smartcampus.assets.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "resources", schema = "assets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "resource_type_id", nullable = false)
    private Integer resourceTypeId;

    @Column(name = "custodian_id")
    private Integer custodianId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "code", nullable = false, length = 50, unique = true)
    private String code;

    @Column(name = "description")
    private String description;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "tags", columnDefinition = "varchar(50)[]")
    private String[] tags;

    @Column(name = "building", length = 100)
    private String building;

    @Column(name = "floor")
    private Short floor;

    @Column(name = "room_no", length = 50)
    private String roomNo;

    @Column(name = "capacity")
    private Short capacity;

    @Column(name = "min_capacity")
    private Short minCapacity;

    @Column(name = "status", nullable = false, length = 25)
    private String status;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "last_serviced_at")
    private LocalDate lastServicedAt;

    @Column(name = "next_service_due")
    private LocalDate nextServiceDue;

    @Column(name = "replacement_cost", precision = 10, scale = 2)
    private BigDecimal replacementCost;

    @Column(name = "max_booking_duration")
    private Short maxBookingDuration;

    @Column(name = "advance_booking_days")
    private Short advanceBookingDays;

    @Column(name = "requires_approval", nullable = false)
    private Boolean requiresApproval;

    @Column(name = "min_notice_minutes")
    private Short minNoticeMinutes;

    @Column(name = "default_open_time")
    private LocalTime defaultOpenTime;

    @Column(name = "default_close_time")
    private LocalTime defaultCloseTime;

    @Column(name = "is_accessible", nullable = false)
    private Boolean isAccessible;

    @Column(name = "accessibility_notes")
    private String accessibilityNotes;

    @Column(name = "primary_image_url", length = 500)
    private String primaryImageUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    void applyDefaults() {
        if (minCapacity == null) {
            minCapacity = 1;
        }
        if (status == null || status.isBlank()) {
            status = "ACTIVE";
        }
        if (isActive == null) {
            isActive = true;
        }
        if (requiresApproval == null) {
            requiresApproval = false;
        }
        if (maxBookingDuration == null) {
            maxBookingDuration = 240;
        }
        if (advanceBookingDays == null) {
            advanceBookingDays = 30;
        }
        if (minNoticeMinutes == null) {
            minNoticeMinutes = 60;
        }
        if (defaultOpenTime == null) {
            defaultOpenTime = LocalTime.of(8, 0);
        }
        if (defaultCloseTime == null) {
            defaultCloseTime = LocalTime.of(18, 0);
        }
        if (isAccessible == null) {
            isAccessible = false;
        }
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    void touchUpdatedAt() {
        updatedAt = OffsetDateTime.now();
    }
}

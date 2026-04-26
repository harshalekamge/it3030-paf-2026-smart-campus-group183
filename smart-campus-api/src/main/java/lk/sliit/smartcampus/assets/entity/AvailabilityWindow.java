package lk.sliit.smartcampus.assets.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "availability_windows", schema = "assets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityWindow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "resource_id", nullable = false)
    private Integer resourceId;

    @Column(name = "day_of_week")
    private Short dayOfWeek;

    @Column(name = "specific_date")
    private LocalDate specificDate;

    @Column(name = "open_time", nullable = false)
    private LocalTime openTime;

    @Column(name = "close_time", nullable = false)
    private LocalTime closeTime;

    @Column(name = "is_closed", nullable = false)
    private Boolean isClosed;

    @Column(name = "valid_from", insertable = false, updatable = false)
    private LocalDate validFrom;

    @Column(name = "valid_until")
    private LocalDate validUntil;

    @Column(name = "note", length = 255)
    private String note;

    @PrePersist
    void applyDefaults() {
        if (isClosed == null) {
            isClosed = false;
        }
    }
}

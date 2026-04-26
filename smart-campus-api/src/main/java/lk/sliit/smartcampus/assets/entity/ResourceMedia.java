package lk.sliit.smartcampus.assets.entity;

import java.time.OffsetDateTime;

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
@Table(name = "resource_media", schema = "assets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "resource_id", nullable = false)
    private Integer resourceId;

    @Column(name = "url", nullable = false, length = 500)
    private String url;

    @Column(name = "media_type", nullable = false, length = 10)
    private String mediaType;

    @Column(name = "caption", length = 255)
    private String caption;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary;

    @Column(name = "display_order", nullable = false)
    private Short displayOrder;

    @Column(name = "uploaded_at", insertable = false, updatable = false)
    private OffsetDateTime uploadedAt;

    @PrePersist
    void applyDefaults() {
        if (mediaType == null || mediaType.isBlank()) {
            mediaType = "IMAGE";
        }
        if (isPrimary == null) {
            isPrimary = false;
        }
        if (displayOrder == null) {
            displayOrder = 0;
        }
    }
}

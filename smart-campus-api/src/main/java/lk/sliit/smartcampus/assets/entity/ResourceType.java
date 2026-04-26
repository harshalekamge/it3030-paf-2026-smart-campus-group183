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
@Table(name = "resource_types", schema = "assets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "type_code", nullable = false, length = 50, unique = true)
    private String typeCode;

    @Column(name = "type_name", nullable = false, length = 100)
    private String typeName;

    @Column(name = "description")
    private String description;

    @Column(name = "requires_capacity")
    private Boolean requiresCapacity;

    @Column(name = "requires_location")
    private Boolean requiresLocation;

    @Column(name = "is_equipment")
    private Boolean isEquipment;

    @Column(name = "icon_slug", length = 100)
    private String iconSlug;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void applyDefaults() {
        if (requiresCapacity == null) {
            requiresCapacity = true;
        }
        if (requiresLocation == null) {
            requiresLocation = true;
        }
        if (isEquipment == null) {
            isEquipment = false;
        }
    }
}

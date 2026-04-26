package lk.sliit.smartcampus.assets.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ResourceAmenityId implements Serializable {

    @Column(name = "resource_id", nullable = false)
    private Integer resourceId;

    @Column(name = "amenity_id", nullable = false)
    private Integer amenityId;
}

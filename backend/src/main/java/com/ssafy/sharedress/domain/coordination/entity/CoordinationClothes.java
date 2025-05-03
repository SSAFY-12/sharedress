package com.ssafy.sharedress.domain.coordination.entity;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coordination_clothes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CoordinationClothes {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Embedded
	private Position position;

	private Float scale;

	private Float rotation;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "coordination_id", nullable = false)
	private Coordination coordination;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "closet_clothes_id", nullable = false)
	private ClosetClothes closetClothes;

	// -- 생성자 -- //
	public CoordinationClothes(Position position, Float scale, Float rotation, Coordination coordination,
		ClosetClothes closetClothes) {
		this.position = position;
		this.scale = scale;
		this.rotation = rotation;
		this.coordination = coordination;
		this.closetClothes = closetClothes;
	}

	public void setCoordination(Coordination coordination) {
		if (this.coordination != null) {
			this.coordination.getCoordinationClothes().remove(this);
		}
		this.coordination = coordination;
		if (coordination != null) {
			coordination.getCoordinationClothes().add(this);
		}
	}
}

package com.ssafy.sharedress.domain.coordination.entity;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;

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
@Table(name = "coordi_clothes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CoordiClothes {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Float posX;
	private Float posY;
	private Float rotation;
	private Float scale;
	private Integer zIndex;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "coordination_id", nullable = false)
	private Coordination coordination;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "closet_clothes_id", nullable = false)
	private ClosetClothes closetClothes;
}

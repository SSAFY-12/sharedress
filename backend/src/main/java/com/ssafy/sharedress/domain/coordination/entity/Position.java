package com.ssafy.sharedress.domain.coordination.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Embeddable
public class Position {

	private Float posX;

	private Float posY;

	private Float rotation;

	private Float scale;

	private Integer zIndex;

	public Position(Float posX, Float posY, Float rotation, Float scale, Integer zIndex) {
		this.posX = posX;
		this.posY = posY;
		this.rotation = rotation;
		this.scale = scale;
		this.zIndex = zIndex;
	}
}

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

	private Integer zIndex;

	public Position(Float posX, Float posY, Integer zIndex) {
		this.posX = posX;
		this.posY = posY;
		this.zIndex = zIndex;
	}
}

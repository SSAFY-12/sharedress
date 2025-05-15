package com.ssafy.sharedress.domain.clothes.entity;

import java.util.Arrays;

import lombok.Getter;

@Getter
public enum AiProcessStatus {
	NOT_PROCESSED("처리 전", 0),
	SUCCESS("처리 성공", 1),
	FAILED("처리 실패", 2);

	private final String description;
	private final Integer code;

	AiProcessStatus(String description, Integer code) {
		this.description = description;
		this.code = code;
	}

	public static AiProcessStatus of(Integer code) {
		return Arrays.stream(values())
			.filter(status -> status.code.equals(code))
			.findFirst()
			.orElse(AiProcessStatus.SUCCESS); // null 처리 시 기본값으로 SUCCESS 반환
	}
}

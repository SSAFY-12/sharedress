package com.ssafy.sharedress.domain.ai.entity;

import java.util.Arrays;

import com.ssafy.sharedress.domain.ai.error.TaskErrorCode;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.Getter;

@Getter
public enum TaskType {
	PURCHASE_HISTORY("구매내역", 1),
	PHOTO("사진", 2);

	private final String description;

	private final Integer code;

	TaskType(String description, Integer code) {
		this.description = description;
		this.code = code;
	}

	public static TaskType of(Integer code) {
		return Arrays.stream(TaskType.values())
			.filter(type -> type.getCode().equals(code))
			.findFirst()
			.orElseThrow(ExceptionUtil.exceptionSupplier(TaskErrorCode.TASK_TYPE_NOT_FOUND));
	}
}

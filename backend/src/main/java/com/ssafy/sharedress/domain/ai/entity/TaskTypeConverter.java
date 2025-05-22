package com.ssafy.sharedress.domain.ai.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class TaskTypeConverter implements AttributeConverter<TaskType, Integer> {

	@Override
	public Integer convertToDatabaseColumn(TaskType taskType) {
		return taskType.getCode();
	}

	@Override
	public TaskType convertToEntityAttribute(Integer integer) {
		return TaskType.of(integer);
	}
}

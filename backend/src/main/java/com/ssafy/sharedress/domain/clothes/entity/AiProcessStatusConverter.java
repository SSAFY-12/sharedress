package com.ssafy.sharedress.domain.clothes.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class AiProcessStatusConverter implements AttributeConverter<AiProcessStatus, Integer> {

	@Override
	public Integer convertToDatabaseColumn(AiProcessStatus aiProcessStatus) {
		return aiProcessStatus.getCode();
	}

	@Override
	public AiProcessStatus convertToEntityAttribute(Integer integer) {
		return AiProcessStatus.of(integer);
	}
}

package com.ssafy.sharedress.domain.clothes.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ClothesSourceTypeConverter implements AttributeConverter<ClothesSourceType, Integer> {

	@Override
	public Integer convertToDatabaseColumn(ClothesSourceType clothesSourceType) {
		return clothesSourceType.getCode();
	}

	@Override
	public ClothesSourceType convertToEntityAttribute(Integer integer) {
		return ClothesSourceType.of(integer);
	}
}

package com.ssafy.sharedress.domain.notification.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class NotificationTypeConverter implements AttributeConverter<NotificationType, Integer> {

	@Override
	public Integer convertToDatabaseColumn(NotificationType notificationType) {
		return notificationType.getCode();
	}

	@Override
	public NotificationType convertToEntityAttribute(Integer integer) {
		return NotificationType.of(integer);
	}
}

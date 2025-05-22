package com.ssafy.sharedress.application.aop;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.ssafy.sharedress.domain.notification.entity.NotificationType;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface SendNotification {
	NotificationType value();
}

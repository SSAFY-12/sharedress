package com.ssafy.sharedress.domain.notification.repository;

import com.ssafy.sharedress.domain.notification.entity.Notification;

public interface NotificationRepository {
	void save(Notification notification);
}

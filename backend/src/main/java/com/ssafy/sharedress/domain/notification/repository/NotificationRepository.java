package com.ssafy.sharedress.domain.notification.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.sharedress.domain.notification.entity.Notification;

public interface NotificationRepository {
	void save(Notification notification);

	List<Notification> findByReceiverId(Long receiverId);

	Optional<Notification> findById(Long id);

	Boolean existsUnReadByReceiverId(Long receiverId);
}

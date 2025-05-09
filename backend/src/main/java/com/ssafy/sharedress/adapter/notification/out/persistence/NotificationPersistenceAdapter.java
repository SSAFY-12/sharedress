package com.ssafy.sharedress.adapter.notification.out.persistence;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.notification.entity.Notification;
import com.ssafy.sharedress.domain.notification.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class NotificationPersistenceAdapter implements NotificationRepository {

	private final NotificationJpaRepository notificationJpaRepository;

	@Override
	public void save(Notification notification) {
		notificationJpaRepository.save(notification);
	}
}

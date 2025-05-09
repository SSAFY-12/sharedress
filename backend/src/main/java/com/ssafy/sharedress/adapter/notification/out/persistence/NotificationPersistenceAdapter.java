package com.ssafy.sharedress.adapter.notification.out.persistence;

import java.util.List;

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

	@Override
	public List<Notification> findByReceiverId(Long receiverId) {
		return notificationJpaRepository.findAllByReceiverIdOrderByCreatedAtDesc(receiverId);
	}
}

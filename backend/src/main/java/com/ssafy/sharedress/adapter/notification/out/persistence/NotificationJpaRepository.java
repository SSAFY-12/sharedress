package com.ssafy.sharedress.adapter.notification.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sharedress.domain.notification.entity.Notification;

public interface NotificationJpaRepository extends JpaRepository<Notification, Long> {
}

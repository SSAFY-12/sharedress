package com.ssafy.sharedress.adapter.notification.out.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.sharedress.domain.notification.entity.Notification;

public interface NotificationJpaRepository extends JpaRepository<Notification, Long> {

	@Query("""
		SELECT n FROM Notification n WHERE n.receiver.id = :receiverId ORDER BY n.createdAt DESC
		""")
	List<Notification> findAllByReceiverIdOrderByCreatedAtDesc(@Param("receiverId") Long receiverId);
}

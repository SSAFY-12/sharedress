package com.ssafy.sharedress.domain.notification.entity;

import com.ssafy.sharedress.domain.common.entity.BaseTimeEntity;
import com.ssafy.sharedress.domain.member.entity.Member;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sender_id")
	private Member sender;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "receiver_id")
	private Member receiver;

	@Convert(converter = NotificationTypeConverter.class)
	private NotificationType type;

	private String title;

	private String body;

	private Boolean isRead;

	public Notification(Member sender, Member receiver, NotificationType type, String title, String body,
		Boolean isRead) {
		this.sender = sender;
		this.receiver = receiver;
		this.type = type;
		this.title = title;
		this.body = body;
		this.isRead = isRead;
	}
}

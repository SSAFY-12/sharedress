package com.ssafy.sharedress.domain.member.entity;

import com.ssafy.sharedress.domain.common.entity.BaseTimeEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String email;

	private String profileUrl;

	private String nickname;

	private String code;

	private String statusMessage;

	private Boolean isPublic;

	private String fcmToken;

	private Boolean notificationStatus;

	public Member(String email, String profileUrl, String nickname, String code) {
		this.email = email;
		this.profileUrl = profileUrl;
		this.nickname = nickname;
		this.code = code;
	}
}

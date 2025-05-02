package com.ssafy.sharedress.application.jwt;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "refresh_token")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class RefreshToken {

	@Id
	private Long memberId;

	@Column(nullable = false)
	private String token;

	public RefreshToken(Long memberId, String token) {
		this.memberId = memberId;
		this.token = token;
	}
}

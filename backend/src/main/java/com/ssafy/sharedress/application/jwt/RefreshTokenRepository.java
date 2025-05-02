package com.ssafy.sharedress.application.jwt;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
	Boolean existsByMemberId(Long memberId);

	void deleteByMemberId(Long memberId);
}

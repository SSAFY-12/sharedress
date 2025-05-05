package com.ssafy.sharedress.application.jwt;

import com.ssafy.sharedress.application.auth.dto.TokenWithRefresh;

import jakarta.servlet.http.HttpServletRequest;

public interface TokenUseCase {
	TokenWithRefresh issueToken(Long memberId);

	TokenResponse refreshToken(HttpServletRequest request);
}

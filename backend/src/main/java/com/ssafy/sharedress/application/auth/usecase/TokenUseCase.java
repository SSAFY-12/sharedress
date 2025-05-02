package com.ssafy.sharedress.application.auth.usecase;

import com.ssafy.sharedress.application.auth.dto.TokenWithRefresh;
import com.ssafy.sharedress.application.jwt.TokenResponse;

import jakarta.servlet.http.HttpServletRequest;

public interface TokenUseCase {
	TokenWithRefresh issueToken(Long memberId);

	TokenResponse refreshToken(HttpServletRequest request);
}

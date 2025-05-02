package com.ssafy.sharedress.application.auth.service;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.auth.dto.TokenWithRefresh;
import com.ssafy.sharedress.application.auth.usecase.TokenUseCase;
import com.ssafy.sharedress.application.jwt.JwtTokenProvider;
import com.ssafy.sharedress.application.jwt.JwtTokenResolver;
import com.ssafy.sharedress.application.jwt.RefreshToken;
import com.ssafy.sharedress.application.jwt.RefreshTokenRepository;
import com.ssafy.sharedress.application.jwt.TokenErrorCode;
import com.ssafy.sharedress.application.jwt.TokenResponse;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenService implements TokenUseCase {

	private final JwtTokenProvider tokenProvider;
	private final JwtTokenResolver tokenResolver;
	private final RefreshTokenRepository refreshTokenRepository;

	@Override
	public TokenWithRefresh issueToken(Long memberId) {
		// JWT 토큰 발급
		String accessToken = tokenProvider.createAccessToken(memberId);
		String refreshToken = tokenProvider.createRefreshToken(memberId);

		// JWT 토큰 저장
		Boolean exists = refreshTokenRepository.existsByMemberId(memberId);
		if (exists) {
			refreshTokenRepository.deleteByMemberId(memberId);
		}
		refreshTokenRepository.save(new RefreshToken(memberId, refreshToken));

		return new TokenWithRefresh(refreshToken, accessToken);
	}

	@Override
	public TokenResponse refreshToken(HttpServletRequest request) {
		// 1. 쿠키에서 refreshToken 추출
		String refreshToken = tokenResolver.resolveRefreshToken(request);
		if (refreshToken == null) {
			ExceptionUtil.throwException(TokenErrorCode.TOKEN_NOT_FOUND);
		}

		// 2. 토큰 유효성 검증
		if (!tokenProvider.validateToken(refreshToken)) {
			ExceptionUtil.throwException(TokenErrorCode.TOKEN_INVALID);
		}

		// 3. 토큰에서 사용자 ID 추출
		Long memberId = Long.valueOf(tokenProvider.getMemberId(refreshToken));

		// 4. DB에서 저장된 refreshToken 조회
		RefreshToken saved = refreshTokenRepository.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(TokenErrorCode.TOKEN_NOT_FOUND));

		if (!saved.getToken().equals(refreshToken)) {
			ExceptionUtil.throwException(TokenErrorCode.TOKEN_INVALID);
		}

		// 5. AccessToken 재발급
		String newAccessToken = tokenProvider.createAccessToken(memberId);

		return new TokenResponse(newAccessToken);
	}
}

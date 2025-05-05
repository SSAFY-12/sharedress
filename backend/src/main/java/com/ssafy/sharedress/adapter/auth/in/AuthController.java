package com.ssafy.sharedress.adapter.auth.in;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.auth.dto.GoogleLoginRequest;
import com.ssafy.sharedress.application.auth.dto.TokenWithRefresh;
import com.ssafy.sharedress.application.auth.usecase.GoogleLoginUseCase;
import com.ssafy.sharedress.application.jwt.TokenResponse;
import com.ssafy.sharedress.application.jwt.TokenUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthController {

	private final GoogleLoginUseCase googleLoginUseCase;
	private final TokenUseCase tokenUseCase;

	@PostMapping("/auth/google")
	public ResponseEntity<ResponseWrapper<TokenResponse>> googleLogin(
		@RequestBody GoogleLoginRequest request,
		HttpServletResponse response
	) {
		TokenWithRefresh token = googleLoginUseCase.login(request.accessToken());

		// refreshToken을 HttpOnly 쿠키로 설정
		Cookie cookie = new Cookie("refreshToken", token.refreshToken());
		cookie.setHttpOnly(true);
		cookie.setSecure(true); // https 환경에서만 사용
		cookie.setPath("/");
		cookie.setMaxAge(7 * 24 * 60 * 60); // 7일

		response.addCookie(cookie);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, new TokenResponse(token.accessToken()));
	}

	@PostMapping("/auth/refresh")
	public ResponseEntity<ResponseWrapper<TokenResponse>> refresh(HttpServletRequest request) {
		TokenResponse result = tokenUseCase.refreshToken(request);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, result);
	}
}

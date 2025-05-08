package com.ssafy.sharedress.adapter.auth.in;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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

		// ✅ ResponseCookie를 통해 SameSite 설정
		ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", token.refreshToken())
			.httpOnly(true)
			.secure(true)                // HTTPS 환경에서만 전송
			.path("/")
			.maxAge(7 * 24 * 60 * 60)    // 7일
			.sameSite("None")            // SameSite=None 설정
			.build();

		response.addHeader("Set-Cookie", refreshTokenCookie.toString());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, new TokenResponse(token.accessToken()));
	}

	@PostMapping("/auth/refresh")
	public ResponseEntity<ResponseWrapper<TokenResponse>> refresh(HttpServletRequest request) {
		TokenResponse result = tokenUseCase.refreshToken(request);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, result);
	}
}

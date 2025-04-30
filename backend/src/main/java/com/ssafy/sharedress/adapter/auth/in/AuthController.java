package com.ssafy.sharedress.adapter.auth.in;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.auth.usecase.GoogleLoginUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthController {

	private final GoogleLoginUseCase googleLoginUseCase;

	@PostMapping("/api/auth/google")
	public ResponseEntity<ResponseWrapper<TokenResponse>> googleLogin(
		@RequestBody GoogleLoginRequest request) {
		String jwt = googleLoginUseCase.login(request.accessToken);
		return ResponseWrapperFactory.toResponseEntity(
			HttpStatus.CREATED, new TokenResponse(jwt));
	}

	@Getter
	static class GoogleLoginRequest {
		private String accessToken;
	}

	record TokenResponse(String accessToken) {
	}
}

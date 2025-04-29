package com.ssafy.sharedress.api.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.api.auth.service.GoogleAuthService;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthController {

	private final GoogleAuthService googleAuthService;

	@PostMapping("/api/auth/google")
	public ResponseEntity<ResponseWrapper<TokenResponse>> googleLogin(@RequestBody GoogleLoginRequest request) {
		String jwt = googleAuthService.loginWithGoogle(request.accessToken);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, new TokenResponse(jwt));
	}

	@Getter
	static class GoogleLoginRequest {
		private String accessToken;
	}

	record TokenResponse(String accessToken) {
	}
}

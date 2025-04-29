package com.ssafy.sharedress.api.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ssafy.sharedress.api.auth.controller.GoogleUserInfoClient;
import com.ssafy.sharedress.api.auth.dto.GoogleUserInfoResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleAuthService {

	private final GoogleUserInfoClient googleUserInfoClient;

	@Value("${google.client-id}")
	private String clientId;

	@Value("${google.client-secret}")
	private String clientSecret;

	@Value("${google.redirect-uri}")
	private String redirectUri;

	public String loginWithGoogle(String accessToken) {
		// 1. user info 얻기
		GoogleUserInfoResponse userInfo = googleUserInfoClient.getUserInfo("Bearer " + accessToken);

		// 2. 로그인/회원가입 처리
		// 여기서 userInfo.getEmail() 등을 활용
		// ex) userService.findOrCreate(userInfo)

		// 3. JWT 토큰 발급
		return "JWT_TOKEN"; // JWT 토큰 발급 로직 추가
	}
}

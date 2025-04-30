package com.ssafy.sharedress.application.auth.service;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.adapter.auth.out.GoogleUserInfoClient;
import com.ssafy.sharedress.application.auth.dto.GoogleUserInfoResponse;
import com.ssafy.sharedress.application.auth.usecase.GoogleLoginUseCase;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GoogleLoginService implements GoogleLoginUseCase {

	private final GoogleUserInfoClient googleUserInfoClient;

	@Override
	public String login(String accessToken) {
		// 1. user info 얻기
		GoogleUserInfoResponse userInfo = googleUserInfoClient.getUserInfo("Bearer " + accessToken);

		// 2. 로그인/회원가입 처리
		// 여기서 userInfo.getEmail() 등을 활용
		// ex) userService.findOrCreate(userInfo)

		// 3. JWT 토큰 발급
		return "JWT_TOKEN"; // JWT 토큰 발급 로직 추가
	}
}

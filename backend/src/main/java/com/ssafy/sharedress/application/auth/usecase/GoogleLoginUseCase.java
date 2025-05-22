package com.ssafy.sharedress.application.auth.usecase;

import com.ssafy.sharedress.application.auth.dto.TokenWithRefresh;

public interface GoogleLoginUseCase {
	TokenWithRefresh login(String accessToken);
}

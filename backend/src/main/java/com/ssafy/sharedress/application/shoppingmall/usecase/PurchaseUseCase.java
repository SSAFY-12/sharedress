package com.ssafy.sharedress.application.shoppingmall.usecase;

import com.ssafy.sharedress.adapter.shoppingmall.out.musinsa.LoginMusinsaClient;
import com.ssafy.sharedress.application.ai.dto.AiTaskResponse;

public interface PurchaseUseCase {
	LoginMusinsaClient.MusinsaResponse loginMusinsa(
		LoginMusinsaClient.LoginRequest request
	);

	AiTaskResponse getMusinsaPurchaseHistory(
		Long memberId,
		Long shopId,
		String appAtk,
		String appRtk,
		String rootOrderNo
	);

	void login29CM(
		String id,
		String password
	);
}

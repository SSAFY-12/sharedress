package com.ssafy.sharedress.application.shoppingmall.usecase;

import com.ssafy.sharedress.adapter.shoppingmall.out.cm29.Login29cmClient;
import com.ssafy.sharedress.adapter.shoppingmall.out.musinsa.LoginMusinsaClient;
import com.ssafy.sharedress.application.ai.dto.AiTaskResponse;
import com.ssafy.sharedress.application.shoppingmall.dto.ShoppingMallLoginRequest;

public interface PurchaseUseCase {
	LoginMusinsaClient.LoginResponse loginMusinsa(ShoppingMallLoginRequest request);

	AiTaskResponse getMusinsaPurchaseHistory(
		Long memberId,
		Long shopId,
		String appAtk,
		String appRtk,
		String rootOrderNo
	);

	Login29cmClient.LoginResponse login29CM(
		String id,
		String password
	);
}

package com.ssafy.sharedress.application.shoppingmall.usecase;

import com.ssafy.sharedress.adapter.shoppingmall.out.musinsa.LoginMusinsaClient;

public interface PurchaseUseCase {
	LoginMusinsaClient.MusinsaResponse loginMusinsa(
		LoginMusinsaClient.LoginRequest request
	);

	void getMusinsaPurchaseHistory(
		Long memberId,
		Long shopId,
		String appAtk,
		String appRtk,
		String rootOrderNo
	);
}

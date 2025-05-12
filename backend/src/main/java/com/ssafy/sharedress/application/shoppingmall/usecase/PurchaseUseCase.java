package com.ssafy.sharedress.application.shoppingmall.usecase;

import com.ssafy.sharedress.adapter.shoppingmall.out.musinsa.LoginMusinsaFeignClient;

public interface PurchaseUseCase {
	LoginMusinsaFeignClient.MusinsaResponse loginMusinsa(
		LoginMusinsaFeignClient.LoginRequest request
	);
}

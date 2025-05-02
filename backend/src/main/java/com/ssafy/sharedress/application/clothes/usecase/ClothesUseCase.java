package com.ssafy.sharedress.application.clothes.usecase;

import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryRequest;

public interface ClothesUseCase {
	// 1. 구매 내역 기반 옷 등록
	void registerClothesFromPurchase(PurchaseHistoryRequest request);
}

package com.ssafy.sharedress.adapter.clothes.in;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryRequest;
import com.ssafy.sharedress.application.clothes.usecase.ClothesUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ClothesController {

	private final ClothesUseCase clothesUseCase;

	@PostMapping("/clothes/purchase-history")
	public ResponseEntity<ResponseWrapper<Void>> registerClothesFromPurchase(
		@RequestBody PurchaseHistoryRequest request) {

		// TODO[지윤]: security context에서 memberId를 가져오는 로직 추가
		Long myId = 1L;
		clothesUseCase.registerClothesFromPurchase(request, myId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.ACCEPTED, null);
	}
}

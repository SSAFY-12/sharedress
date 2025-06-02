package com.ssafy.sharedress.adapter.shoppingmall.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.adapter.shoppingmall.out.musinsa.LoginMusinsaClient;
import com.ssafy.sharedress.application.ai.dto.AiTaskResponse;
import com.ssafy.sharedress.application.member.annotation.CurrentMember;
import com.ssafy.sharedress.application.shoppingmall.dto.ShoppingMallLoginRequest;
import com.ssafy.sharedress.application.shoppingmall.dto.ShoppingMallResponse;
import com.ssafy.sharedress.application.shoppingmall.usecase.PurchaseUseCase;
import com.ssafy.sharedress.application.shoppingmall.usecase.ShoppingMallUseCase;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.shoppingmall.error.ShoppingMallErrorCode;
import com.ssafy.sharedress.global.exception.ExceptionUtil;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ShoppingMallController {

	private final ShoppingMallUseCase shoppingMallUseCase;
	private final PurchaseUseCase purchaseUseCase;

	@GetMapping("/clothes/shoppingmalls")
	public ResponseEntity<ResponseWrapper<List<ShoppingMallResponse>>> getAllShoppingMalls() {
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, shoppingMallUseCase.getAllShoppingMalls());
	}

	@PostMapping("closet/clothes/purchase-history")
	public ResponseEntity<ResponseWrapper<AiTaskResponse>> purchaseClothes(
		@CurrentMember Member member,
		@RequestBody ShoppingMallLoginRequest request
	) {
		if (request.shopId() == 1) {
			LoginMusinsaClient.LoginTokens tokens = purchaseUseCase.loginMusinsa(request).tokens();
			AiTaskResponse result = purchaseUseCase.getMusinsaPurchaseHistory(
				member.getId(),
				request.shopId(),
				tokens.app_atk(),
				tokens.app_rtk(),
				null
			);
			return ResponseWrapperFactory.toResponseEntity(HttpStatus.ACCEPTED, result);
		}

		if (request.shopId() == 3) {
			String cookie = purchaseUseCase.login29CM(request).cookie();
			if (cookie == null || cookie.isEmpty()) {
				ExceptionUtil.throwException(ShoppingMallErrorCode.SHOPPING_MALL_ID_PW_NOT_MATCH);
			}
			// 1. 양쪽 대괄호 제거
			String noBrackets = cookie.replaceAll("^\\[|\\]$", "");

			// 2. 쿠키 항목별로 split
			String[] cookieEntries = noBrackets.split(", ");

			// 3. 각 항목에서 첫 번째 세미콜론 앞까지만 남김
			StringBuilder cookieHeader = new StringBuilder();
			for (String entry : cookieEntries) {
				int endIndex = entry.indexOf(';');
				if (endIndex != -1) {
					cookieHeader.append(entry, 0, endIndex).append("; ");
				}
			}
			AiTaskResponse result = purchaseUseCase.get29CmPurchaseHistory(
				member.getId(),
				request.shopId(),
				cookieHeader.toString().trim(),
				null
			);
			return ResponseWrapperFactory.toResponseEntity(HttpStatus.ACCEPTED, result);
		}
		return null;
	}
}

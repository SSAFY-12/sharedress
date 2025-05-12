package com.ssafy.sharedress.adapter.shoppingmall.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.adapter.shoppingmall.out.musinsa.LoginMusinsaFeignClient;
import com.ssafy.sharedress.application.member.annotation.CurrentMember;
import com.ssafy.sharedress.application.shoppingmall.dto.ShoppingMallResponse;
import com.ssafy.sharedress.application.shoppingmall.usecase.PurchaseUseCase;
import com.ssafy.sharedress.application.shoppingmall.usecase.ShoppingMallUseCase;
import com.ssafy.sharedress.domain.member.entity.Member;
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
	public ResponseEntity<ResponseWrapper<Void>> purchaseClothes(
		@CurrentMember Member member,
		@RequestBody LoginMusinsaFeignClient.LoginRequest request
	) {
		log.info("token= {}", purchaseUseCase.loginMusinsa(request).tokens());

		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}

}

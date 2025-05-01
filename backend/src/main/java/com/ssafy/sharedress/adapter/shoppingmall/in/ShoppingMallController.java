package com.ssafy.sharedress.adapter.shoppingmall.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.shoppingmall.dto.ShoppingMallResponse;
import com.ssafy.sharedress.application.shoppingmall.usecase.ShoppingMallUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ShoppingMallController {

	private final ShoppingMallUseCase shoppingMallUseCase;

	@GetMapping("/clothes/shoppingmalls")
	public ResponseEntity<ResponseWrapper<List<ShoppingMallResponse>>> getAllShoppingMalls() {
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, shoppingMallUseCase.getAllShoppingMalls());
	}
}

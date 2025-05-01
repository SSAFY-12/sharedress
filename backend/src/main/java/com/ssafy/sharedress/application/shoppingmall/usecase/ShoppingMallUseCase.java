package com.ssafy.sharedress.application.shoppingmall.usecase;

import java.util.List;

import com.ssafy.sharedress.application.shoppingmall.dto.ShoppingMallResponse;

public interface ShoppingMallUseCase {
	List<ShoppingMallResponse> getAllShoppingMalls();
}

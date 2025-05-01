package com.ssafy.sharedress.application.shoppingmall.dto;

import com.ssafy.sharedress.domain.shoppingmall.entity.ShoppingMall;

public record ShoppingMallResponse(
	Long id,
	String name,
	String homepageLink,
	String paymentHistoryLink
) {
	public static ShoppingMallResponse from(ShoppingMall shoppingMall) {
		return new ShoppingMallResponse(
			shoppingMall.getId(),
			shoppingMall.getName(),
			shoppingMall.getUrlLink(),
			shoppingMall.getHistoryUrlLink()
		);
	}

}

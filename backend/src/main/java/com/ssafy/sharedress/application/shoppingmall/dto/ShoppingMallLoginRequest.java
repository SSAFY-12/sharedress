package com.ssafy.sharedress.application.shoppingmall.dto;

public record ShoppingMallLoginRequest(
	Long shopId,
	String id,
	String password
) {
}

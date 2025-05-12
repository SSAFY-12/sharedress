package com.ssafy.sharedress.adapter.shoppingmall.out.musinsa;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.ssafy.sharedress.application.shoppingmall.dto.MusinsaOrderResponse;

import feign.Headers;

@FeignClient(
	name = "musinsaOrderClient",
	url = "https://api.musinsa.com"
)
public interface MusinsaPurchaseClient {
	@GetMapping("/api2/claim/store/mypage/integration/order")
	@Headers("Content-Type: application/json")
	MusinsaOrderResponse getOrderHistory(
		@RequestHeader("Cookie") String cookieHeader,
		@RequestParam(value = "onlineOffset", required = false) String onlineOffset
	);
}

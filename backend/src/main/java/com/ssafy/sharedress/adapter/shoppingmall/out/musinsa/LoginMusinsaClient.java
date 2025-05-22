package com.ssafy.sharedress.adapter.shoppingmall.out.musinsa;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.ssafy.sharedress.config.MusinsaFeignConfig;

@FeignClient(
	name = "loginMusinsaClient",
	url = "http://musinsa:3000",
	configuration = MusinsaFeignConfig.class
)
public interface LoginMusinsaClient {

	@PostMapping("/login")
	MusinsaResponse login(@RequestBody LoginRequest request);

	record LoginRequest(
		Long shopId,
		String id,
		String password
	) {
	}

	record MusinsaResponse(
		String message,
		Tokens tokens
	) {
	}

	record Tokens(
		String app_atk,
		String app_rtk
	) {
	}
}

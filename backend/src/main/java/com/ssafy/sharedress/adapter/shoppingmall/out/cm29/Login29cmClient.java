package com.ssafy.sharedress.adapter.shoppingmall.out.cm29;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.ssafy.sharedress.config.CM29FeignConfig;

import feign.Response;

@FeignClient(
	name = "login29cmClient",
	url = "https://apihub.29cm.co.kr",
	configuration = CM29FeignConfig.class
)
public interface Login29cmClient {

	@PostMapping(value = "/user/login/", consumes = "application/json")
	Response login(@RequestBody LoginRequest request);

	record LoginRequest(
		String user_id,
		String user_password
	) {
	}

	record LoginResponse(
		String token
	) {
	}
}

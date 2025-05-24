package com.ssafy.sharedress.adapter.shoppingmall.out.cm29;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.ssafy.sharedress.application.shoppingmall.dto.CM29OrderResponse;

@FeignClient(
	name = "cm29OrderClient",
	url = "https://apihub.29cm.co.kr"
)
public interface CM29PurchaseClient {
	@GetMapping("/order/orders/my-order")
	CM29OrderResponse getOrderHistory(
		@RequestHeader("Cookie") String cookieHeader,
		@RequestParam(value = "offset", required = false) String offset
	);
}

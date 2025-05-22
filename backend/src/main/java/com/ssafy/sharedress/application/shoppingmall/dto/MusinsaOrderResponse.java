package com.ssafy.sharedress.application.shoppingmall.dto;

import java.util.List;

public record MusinsaOrderResponse(
	List<OrderData> data,
	Meta meta
) {

	public record OrderData(String rootOrderNo, List<OrderOption> orderOptionList) {

	}

	public record OrderOption(
		String orderStateText,
		String brandName,
		String goodsName,
		String goodsNo,
		String brandId
	) {
	}

	public record Meta(
		String onlineOffset,
		String result,
		String errorCode,
		String message
	) {
	}
}

package com.ssafy.sharedress.application.shoppingmall.dto;

import java.util.List;

public record CM29OrderResponse(
	int count,
	String next,
	String previous,
	List<Result> results
) {
	public record Result(
		long order_no,
		String order_serial,
		List<Manage> manages
	) {
	}

	public record Manage(
		OrderItem order_item_no,
		String order_item_delivery_status_description
	) {
	}

	public record OrderItem(
		String item_no,
		String brand_name,
		String front_brand_name,
		String item_name,
		String item_image_url_full
	) {
	}
}

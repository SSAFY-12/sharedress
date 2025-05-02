package com.ssafy.sharedress.application.clothes.dto;

public record PurchaseHistoryItem(
	String image,
	String name,
	String brandNameKor,
	String brandNameEng,
	String linkUrl
) {
}

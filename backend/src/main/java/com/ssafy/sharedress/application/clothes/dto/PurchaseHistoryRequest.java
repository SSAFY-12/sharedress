package com.ssafy.sharedress.application.clothes.dto;

import java.util.List;

public record PurchaseHistoryRequest(
	Long shopId,
	List<PurchaseHistoryItem> items
) {
}

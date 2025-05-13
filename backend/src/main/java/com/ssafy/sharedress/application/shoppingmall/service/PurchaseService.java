package com.ssafy.sharedress.application.shoppingmall.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ssafy.sharedress.adapter.shoppingmall.out.musinsa.LoginMusinsaClient;
import com.ssafy.sharedress.adapter.shoppingmall.out.musinsa.MusinsaPurchaseClient;
import com.ssafy.sharedress.application.closet.service.ClosetClothesService;
import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryItem;
import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryRequest;
import com.ssafy.sharedress.application.shoppingmall.dto.MusinsaOrderResponse;
import com.ssafy.sharedress.application.shoppingmall.usecase.PurchaseUseCase;
import com.ssafy.sharedress.domain.shoppingmall.error.ShoppingMallErrorCode;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PurchaseService implements PurchaseUseCase {
	private final LoginMusinsaClient loginMusinsaClient;
	private final MusinsaPurchaseClient musinsaPurchaseClient;
	private final ClosetClothesService closetClothesService;

	@Override
	public LoginMusinsaClient.MusinsaResponse loginMusinsa(LoginMusinsaClient.LoginRequest request) {
		try {
			return loginMusinsaClient.login(new LoginMusinsaClient.LoginRequest(request.shopId(), request.id(),
				request.password()));
		} catch (ResponseStatusException e) {
			if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
				ExceptionUtil.throwException(ShoppingMallErrorCode.SHOPPING_MALL_ID_PW_NOT_MATCH);
			} else {
				throw new RuntimeException("무신사 로그인 서버 오류 발생");
			}
		} catch (Exception e) {
			log.error("Openfeign error: {}", e.getMessage());
			throw new RuntimeException("무신사 로그인 서버 오류 발생");
		}
		return null;
	}

	@Override
	public void getMusinsaPurchaseHistory(Long memberId, Long shopId, String appAtk, String appRtk,
		String rootOrderNo) {
		List<MusinsaOrderResponse.OrderOption> allOrders = new ArrayList<>();
		String onlineOffset = null;
		boolean hasMore = true;

		while (hasMore) {
			String cookieHeader = "app_atk=" + appAtk + "; app_rtk=" + appRtk;
			MusinsaOrderResponse orderResponse = musinsaPurchaseClient.getOrderHistory(cookieHeader, onlineOffset);

			if (orderResponse == null || orderResponse.data() == null) {
				break;
			}

			// "구매 확정"인 주문 필터링
			List<MusinsaOrderResponse.OrderOption> confirmedOrders = orderResponse.data().stream()
				.flatMap(data -> data.orderOptionList().stream())
				.filter(option -> "구매 확정".equals(option.orderStateText()))
				.toList();
			allOrders.addAll(confirmedOrders);

			// 메타 데이터에서 onlineOffset 가져오기
			onlineOffset = orderResponse.meta().onlineOffset();

			// 다음 요청이 필요한지 판단
			String finalOnlineOffset = onlineOffset;
			hasMore = orderResponse.data().stream()
				.anyMatch(data -> data.rootOrderNo().equals(finalOnlineOffset));

			if (!hasMore) {
				break;
			}
		}

		PurchaseHistoryRequest request = new PurchaseHistoryRequest(
			shopId,
			allOrders.stream()
				.map(order -> new PurchaseHistoryItem(
					order.goodsName(),
					order.brandName(),
					order.brandId(),
					"https://www.musinsa.com/products/" + order.goodsNo()
				))
				.toList()
		);
		closetClothesService.registerClothesFromPurchase(request, memberId);
	}
}

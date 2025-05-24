package com.ssafy.sharedress.application.shoppingmall.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ssafy.sharedress.adapter.shoppingmall.out.cm29.CM29PurchaseClient;
import com.ssafy.sharedress.adapter.shoppingmall.out.cm29.Login29cmClient;
import com.ssafy.sharedress.adapter.shoppingmall.out.musinsa.LoginMusinsaClient;
import com.ssafy.sharedress.adapter.shoppingmall.out.musinsa.MusinsaPurchaseClient;
import com.ssafy.sharedress.application.ai.dto.AiTaskResponse;
import com.ssafy.sharedress.application.closet.service.ClosetClothesService;
import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryItem;
import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryRequest;
import com.ssafy.sharedress.application.shoppingmall.dto.CM29OrderResponse;
import com.ssafy.sharedress.application.shoppingmall.dto.MusinsaOrderResponse;
import com.ssafy.sharedress.application.shoppingmall.dto.ShoppingMallLoginRequest;
import com.ssafy.sharedress.application.shoppingmall.usecase.PurchaseUseCase;
import com.ssafy.sharedress.domain.shoppingmall.error.ShoppingMallErrorCode;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import feign.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PurchaseService implements PurchaseUseCase {
	private final LoginMusinsaClient loginMusinsaClient;
	private final MusinsaPurchaseClient musinsaPurchaseClient;
	private final Login29cmClient login29cmClient;
	private final CM29PurchaseClient cm29PurchaseClient;
	private final ClosetClothesService closetClothesService;

	@Override
	public LoginMusinsaClient.LoginResponse loginMusinsa(ShoppingMallLoginRequest request) {
		try {
			return loginMusinsaClient.login(
				new LoginMusinsaClient.LoginRequest(
					request.shopId(),
					request.id(),
					request.password())
			);
		} catch (ResponseStatusException e) {
			if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
				ExceptionUtil.throwException(ShoppingMallErrorCode.SHOPPING_MALL_ID_PW_NOT_MATCH);
			} else if (e.getStatusCode() == HttpStatus.FORBIDDEN) {
				ExceptionUtil.throwException(ShoppingMallErrorCode.SHOPPING_MALL_BLOCKED);
			} else {
				throw new RuntimeException("무신사 로그인 서버 오류 발생");
			}
		} catch (Exception e) {
			log.error("Musinsa Openfeign error: {}", e.getMessage());
			throw new RuntimeException("무신사 로그인 서버 오류 발생");
		}
		return null;
	}

	@Override
	public AiTaskResponse getMusinsaPurchaseHistory(
		Long memberId,
		Long shopId,
		String appAtk,
		String appRtk,
		String rootOrderNo
	) {
		List<MusinsaOrderResponse.OrderOption> allOrders = new ArrayList<>();
		String onlineOffset = null;

		while (true) {
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
			boolean hasMore = orderResponse.data().stream()
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
		return closetClothesService.registerClothesFromPurchase(request, memberId);
	}

	@Override
	public Login29cmClient.LoginResponse login29CM(ShoppingMallLoginRequest request) {
		// 🔸 로그인 요청 후 응답 받기
		try (Response response = login29cmClient.login(
			new Login29cmClient.LoginRequest(request.id(), request.password())
		)) {
			// 🔸 Set-Cookie 헤더에서 `_ftwuid` 추출
			String cookie = response.headers()
				.getOrDefault("Set-Cookie", List.of())
				.toString();

			if (cookie.length() < 10) {
				ExceptionUtil.throwException(ShoppingMallErrorCode.SHOPPING_MALL_ID_PW_NOT_MATCH);
			}

			return new Login29cmClient.LoginResponse(cookie);
		} catch (ResponseStatusException e) {
			if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
				ExceptionUtil.throwException(ShoppingMallErrorCode.SHOPPING_MALL_ID_PW_NOT_MATCH);
			} else if (e.getStatusCode() == HttpStatus.FORBIDDEN) {
				ExceptionUtil.throwException(ShoppingMallErrorCode.SHOPPING_MALL_BLOCKED);
			} else {
				throw new RuntimeException("29CM 로그인 서버 오류 발생");
			}
		}
		return null;
	}

	@Override
	public AiTaskResponse get29CmPurchaseHistory(Long memberId, Long shopId, String cookie, String rootOrderNo) {
		List<CM29OrderResponse.OrderItem> allOrders = new ArrayList<>();
		String offset = null;
		while (true) {
			CM29OrderResponse orderResponse = cm29PurchaseClient.getOrderHistory(cookie, offset);

			if (orderResponse == null || orderResponse.results() == null) {
				break;
			}

			// "구매 확정"인 주문 필터링
			for (CM29OrderResponse.Result order : orderResponse.results()) {
				for (CM29OrderResponse.Manage manage : order.manages()) {
					if ("배송완료".equals(manage.order_item_delivery_status_description())) {
						allOrders.add(manage.order_item_no());
					}
				}
			}

			// 메타 데이터에서 onlineOffset 가져오기
			offset = orderResponse.next();

			// 다음 요청이 필요한지 판단
			boolean hasMore = offset != null;

			if (!hasMore) {
				break;
			}
		}

		PurchaseHistoryRequest request = new PurchaseHistoryRequest(
			shopId,
			allOrders.stream()
				.map(order -> new PurchaseHistoryItem(
					order.item_name(),
					order.front_brand_name(),
					order.brand_name(),
					"https://product.29cm.co.kr/catalog/" + order.item_no()
				))
				.toList()
		);
		return closetClothesService.registerClothesFromPurchase(request, memberId);
	}
}

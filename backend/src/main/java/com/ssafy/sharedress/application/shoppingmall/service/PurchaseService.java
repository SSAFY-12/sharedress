package com.ssafy.sharedress.application.shoppingmall.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ssafy.sharedress.adapter.shoppingmall.out.musinsa.LoginMusinsaFeignClient;
import com.ssafy.sharedress.application.shoppingmall.usecase.PurchaseUseCase;
import com.ssafy.sharedress.domain.shoppingmall.error.ShoppingMallErrorCode;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PurchaseService implements PurchaseUseCase {
	private final LoginMusinsaFeignClient loginMusinsaFeignClient;

	@Override
	public LoginMusinsaFeignClient.MusinsaResponse loginMusinsa(LoginMusinsaFeignClient.LoginRequest request) {
		try {
			return loginMusinsaFeignClient.login(new LoginMusinsaFeignClient.LoginRequest(request.id(),
				request.password()));
		} catch (ResponseStatusException e) {
			if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
				ExceptionUtil.throwException(ShoppingMallErrorCode.SHOPPING_MALL_ID_PW_NOT_MATCH);
			} else {
				throw new RuntimeException("무신사 로그인 서버 오류 발생");
			}
		} catch (Exception e) {
			throw new RuntimeException("무신사 로그인 서버 오류 발생");
		}
		return null;
	}
}

package com.ssafy.sharedress.application.shoppingmall.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.shoppingmall.dto.ShoppingMallResponse;
import com.ssafy.sharedress.application.shoppingmall.usecase.ShoppingMallUseCase;
import com.ssafy.sharedress.domain.shoppingmall.repository.ShoppingMallRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShoppingMallService implements ShoppingMallUseCase {

	private final ShoppingMallRepository shoppingMallRepository;

	@Override
	public List<ShoppingMallResponse> getAllShoppingMalls() {
		return shoppingMallRepository.findAllByOrderByIdAsc()
			.stream()
			.map(ShoppingMallResponse::from)
			.toList();
	}
}

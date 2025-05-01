package com.ssafy.sharedress.domain.shoppingmall.repository;

import java.util.List;

import com.ssafy.sharedress.domain.shoppingmall.entity.ShoppingMall;

public interface ShoppingMallRepository {
	List<ShoppingMall> findAllByOrderByIdAsc();
}

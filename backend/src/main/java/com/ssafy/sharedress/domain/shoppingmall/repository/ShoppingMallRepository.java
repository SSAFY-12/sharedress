package com.ssafy.sharedress.domain.shoppingmall.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.sharedress.domain.shoppingmall.entity.ShoppingMall;

public interface ShoppingMallRepository {

	List<ShoppingMall> findAllByOrderByIdAsc();

	Optional<ShoppingMall> findById(Long id);
}

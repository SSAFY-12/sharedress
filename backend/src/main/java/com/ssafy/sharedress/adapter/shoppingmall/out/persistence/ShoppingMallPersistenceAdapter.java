package com.ssafy.sharedress.adapter.shoppingmall.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.shoppingmall.entity.ShoppingMall;
import com.ssafy.sharedress.domain.shoppingmall.repository.ShoppingMallRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ShoppingMallPersistenceAdapter implements ShoppingMallRepository {

	private final ShoppingMallJpaRepository shoppingMallJpaRepository;

	@Override
	public List<ShoppingMall> findAllByOrderByIdAsc() {
		return shoppingMallJpaRepository.findAllByOrderByIdAsc();
	}

	@Override
	public Optional<ShoppingMall> findById(Long id) {
		return shoppingMallJpaRepository.findById(id);
	}

	@Override
	public ShoppingMall getReferenceById(Long id) {
		return shoppingMallJpaRepository.getReferenceById(id);
	}
}

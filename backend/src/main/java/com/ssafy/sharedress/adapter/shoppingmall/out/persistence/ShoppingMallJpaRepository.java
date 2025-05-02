package com.ssafy.sharedress.adapter.shoppingmall.out.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sharedress.domain.shoppingmall.entity.ShoppingMall;

public interface ShoppingMallJpaRepository extends JpaRepository<ShoppingMall, Long> {
	List<ShoppingMall> findAllByOrderByIdAsc();
}

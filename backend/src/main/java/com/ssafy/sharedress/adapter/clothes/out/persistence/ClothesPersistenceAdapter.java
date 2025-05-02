package com.ssafy.sharedress.adapter.clothes.out.persistence;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.clothes.entity.Clothes;
import com.ssafy.sharedress.domain.clothes.repository.ClothesRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ClothesPersistenceAdapter implements ClothesRepository {

	private final ClothesJpaRepository clothesJpaRepository;

	@Override
	public Clothes save(Clothes clothes) {
		return clothesJpaRepository.save(clothes);
	}
}

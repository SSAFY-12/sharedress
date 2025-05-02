package com.ssafy.sharedress.domain.clothes.repository;

import java.util.Optional;

import com.ssafy.sharedress.domain.clothes.entity.Clothes;

public interface ClothesRepository {
	Clothes save(Clothes clothes);

	Optional<Clothes> findByNameAndBrandId(String name, Long brandId);

}

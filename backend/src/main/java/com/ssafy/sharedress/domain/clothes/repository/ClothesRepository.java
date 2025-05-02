package com.ssafy.sharedress.domain.clothes.repository;

import com.ssafy.sharedress.domain.clothes.entity.Clothes;

public interface ClothesRepository {
	Clothes save(Clothes clothes);
}

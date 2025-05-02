package com.ssafy.sharedress.domain.brand.repository;

import java.util.List;

import com.ssafy.sharedress.domain.brand.entity.Brand;

public interface BrandRepository {
	List<Brand> findAll();

	List<Brand> findByNameContaining(String keyword);
}

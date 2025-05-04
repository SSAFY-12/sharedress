package com.ssafy.sharedress.domain.brand.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.sharedress.domain.brand.entity.Brand;

public interface BrandRepository {
	List<Brand> findAll();

	List<Brand> findByNameContaining(String keyword);

	Optional<Brand> findByExactNameEnOrKr(String nameEn, String nameKr);

	Brand save(Brand brand);

	Optional<Brand> findById(Long id);

	Brand getReferenceById(Long id);
}

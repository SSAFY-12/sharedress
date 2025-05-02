package com.ssafy.sharedress.adapter.brand.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.brand.entity.Brand;
import com.ssafy.sharedress.domain.brand.repository.BrandRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BrandPersistenceAdapter implements BrandRepository {

	private final BrandJpaRepository brandJpaRepository;

	@Override
	public List<Brand> findAll() {
		return brandJpaRepository.findAll();
	}

	@Override
	public List<Brand> findByNameContaining(String keyword) {
		return brandJpaRepository.searchByKeyword(keyword);
	}

	@Override
	public Optional<Brand> findByExactNameEnOrKr(String nameEn, String nameKr) {
		return brandJpaRepository.findByExactNameEnOrKr(nameEn, nameKr);
	}

	@Override
	public Brand save(Brand brand) {
		return brandJpaRepository.save(brand);
	}
}

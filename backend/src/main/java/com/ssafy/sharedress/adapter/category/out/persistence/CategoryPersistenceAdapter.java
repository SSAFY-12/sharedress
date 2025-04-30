package com.ssafy.sharedress.adapter.category.out.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.category.entity.Category;
import com.ssafy.sharedress.domain.category.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CategoryPersistenceAdapter implements CategoryRepository {

	private final CategoryJpaRepository categoryJpaRepository;

	public List<Category> findAllByOrderByIdAsc() {
		return categoryJpaRepository.findAllByOrderByIdAsc();
	}
}

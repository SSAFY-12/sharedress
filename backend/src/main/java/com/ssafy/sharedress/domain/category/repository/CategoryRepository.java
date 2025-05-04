package com.ssafy.sharedress.domain.category.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.sharedress.domain.category.entity.Category;

public interface CategoryRepository {
	List<Category> findAllByOrderByIdAsc();

	Optional<Category> findById(Long id);

	Category getReferenceById(Long id);
}

package com.ssafy.sharedress.domain.category.repository;

import java.util.List;

import com.ssafy.sharedress.domain.category.entity.Category;

public interface CategoryRepository {
	List<Category> findAllByOrderByIdAsc();
}

package com.ssafy.sharedress.adapter.category.out.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sharedress.domain.category.entity.Category;

public interface CategoryJpaRepository extends JpaRepository<Category, Long> {
	List<Category> findAllByOrderByIdAsc();
}

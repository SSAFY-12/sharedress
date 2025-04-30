package com.ssafy.sharedress.domain.category.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.domain.category.entity.Category;
import com.ssafy.sharedress.domain.category.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CategoryDomainService {

	private final CategoryRepository categoryRepository;

	public List<Category> findAll() {
		return categoryRepository.findAllByOrderByIdAsc();
	}
}

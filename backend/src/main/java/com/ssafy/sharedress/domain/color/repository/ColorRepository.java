package com.ssafy.sharedress.domain.color.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.sharedress.domain.color.entity.Color;

public interface ColorRepository {
	List<Color> findAllByOrderByIdAsc();

	Optional<Color> findById(Long id);

	Color getReferenceById(Long id);
}

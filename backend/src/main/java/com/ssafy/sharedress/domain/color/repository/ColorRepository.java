package com.ssafy.sharedress.domain.color.repository;

import java.util.List;

import com.ssafy.sharedress.domain.color.entity.Color;

public interface ColorRepository {
	List<Color> findAllByOrderByIdAsc();
}

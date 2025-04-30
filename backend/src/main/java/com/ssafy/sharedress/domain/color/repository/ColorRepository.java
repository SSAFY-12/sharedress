package com.ssafy.sharedress.domain.color.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sharedress.domain.color.entity.Color;

public interface ColorRepository extends JpaRepository<Color, Long> {
	List<Color> findAllByOrderByIdAsc();
}

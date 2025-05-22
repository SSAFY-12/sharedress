package com.ssafy.sharedress.adapter.color.out.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sharedress.domain.color.entity.Color;

public interface ColorJpaRepository extends JpaRepository<Color, Long> {
	List<Color> findAllByOrderByIdAsc();
}

package com.ssafy.sharedress.adapter.color.out.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.color.entity.Color;
import com.ssafy.sharedress.domain.color.repository.ColorRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ColorPersistenceAdapter implements ColorRepository {

	private final ColorJpaRepository colorJpaRepository;

	@Override
	public List<Color> findAllByOrderByIdAsc() {
		return colorJpaRepository.findAllByOrderByIdAsc();
	}
}

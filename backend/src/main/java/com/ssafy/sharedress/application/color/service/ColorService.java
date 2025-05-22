package com.ssafy.sharedress.application.color.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.color.dto.ColorResponse;
import com.ssafy.sharedress.application.color.usecase.ColorUseCase;
import com.ssafy.sharedress.domain.color.entity.Color;
import com.ssafy.sharedress.domain.color.repository.ColorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ColorService implements ColorUseCase {

	private final ColorRepository colorRepository;

	@Override
	public List<ColorResponse> getAllColors() {
		List<Color> colors = colorRepository.findAllByOrderByIdAsc();

		return colors.stream()
			.filter(color -> !color.getId().equals(-1L)) // color_id = -1 제외
			.map(ColorResponse::from)
			.toList();
	}
}

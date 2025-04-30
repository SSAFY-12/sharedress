package com.ssafy.sharedress.api.color.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.api.color.dto.ColorDto;
import com.ssafy.sharedress.domain.color.entity.Color;
import com.ssafy.sharedress.domain.color.service.ColorDomainService;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ColorController {

	private final ColorDomainService colorDomainService;

	@GetMapping("/clothes/colors")
	public ResponseEntity<ResponseWrapper<List<ColorDto>>> getAllColors() {
		List<Color> colors = colorDomainService.getAllColors();
		List<ColorDto> result = colors.stream()
			.map(ColorDto::from)
			.toList();
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}
}

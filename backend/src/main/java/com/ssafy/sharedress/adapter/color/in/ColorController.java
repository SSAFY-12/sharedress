package com.ssafy.sharedress.adapter.color.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.color.dto.ColorResponse;
import com.ssafy.sharedress.application.color.usecase.ColorUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ColorController {

	private final ColorUseCase colorUseCase;

	@GetMapping("/clothes/colors")
	public ResponseEntity<ResponseWrapper<List<ColorResponse>>> getAllColors() {
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, colorUseCase.getAllColors());
	}
}

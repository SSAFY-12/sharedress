package com.ssafy.sharedress.application.color.usecase;

import java.util.List;

import com.ssafy.sharedress.application.color.dto.ColorResponse;

public interface ColorUseCase {
	List<ColorResponse> getAllColors();
}

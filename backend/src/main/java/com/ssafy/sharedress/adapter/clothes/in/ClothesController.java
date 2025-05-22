package com.ssafy.sharedress.adapter.clothes.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.ai.usecase.AiTaskUseCase;
import com.ssafy.sharedress.application.clothes.dto.AiPhotoCompleteRequest;
import com.ssafy.sharedress.application.clothes.dto.AiPurchaseCompleteRequest;
import com.ssafy.sharedress.application.clothes.dto.ClothesSearchResponse;
import com.ssafy.sharedress.application.clothes.usecase.ClothesUseCase;
import com.ssafy.sharedress.global.dto.CursorPageResult;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ClothesController {

	private final ClothesUseCase clothesUseCase;
	private final AiTaskUseCase aiTaskUseCase;

	@GetMapping("/clothes")
	public ResponseEntity<ResponseWrapper<List<ClothesSearchResponse>>> getClothes(
		@RequestParam(required = false) String keyword,
		@RequestParam(required = false) Long categoryId,
		@RequestParam(required = false) Long shopId,
		@RequestParam(required = false) Long cursor,
		@RequestParam(defaultValue = "12") int size
	) {
		CursorPageResult<ClothesSearchResponse> result =
			clothesUseCase.getLibraryClothes(keyword, categoryId, shopId, cursor, size);

		return ResponseWrapperFactory.toPageResponseEntity(HttpStatus.OK, result);
	}

	@PostMapping("/clothes/ai-complete")
	public ResponseEntity<ResponseWrapper<Void>> completeClothesPreprocessing(
		@RequestBody AiPurchaseCompleteRequest request) {
		clothesUseCase.markClothesAsAiCompleted(request.memberId(), request.successClothes(), request.failClothes());
		aiTaskUseCase.updateCompletedAiTask(request.taskId());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}

	@PostMapping("/photo/ai-complete")
	public ResponseEntity<ResponseWrapper<Void>> completePhotoPreprocessing(
		@RequestBody AiPhotoCompleteRequest request) {
		clothesUseCase.markPhotoClothesAsAiCompleted(
			request.memberId(),
			request.successClosetClothes(),
			request.failClosetClothes()
		);
		aiTaskUseCase.updateCompletedAiTask(request.taskId());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}
}

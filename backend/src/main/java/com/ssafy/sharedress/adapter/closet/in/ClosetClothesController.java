package com.ssafy.sharedress.adapter.closet.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.closet.dto.ClosetClothesResponse;
import com.ssafy.sharedress.application.closet.usecase.ClosetClothesQueryUseCase;
import com.ssafy.sharedress.global.dto.CursorPageResult;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ClosetClothesController {

	private final ClosetClothesQueryUseCase closetClothesQueryUseCase;

	@GetMapping("/closet/{memberId}")
	public ResponseEntity<ResponseWrapper<List<ClosetClothesResponse>>> getMemberClosetClothes(
		@PathVariable("memberId") Long targetMemberId,
		@RequestParam(required = false) Long categoryId,
		@RequestParam(required = false) Long cursor,
		@RequestParam(defaultValue = "20") int size
	) {
		// TODO[준]: security context 에서 myId 가져오기
		Long myId = 1L;
		CursorPageResult<ClosetClothesResponse> result = closetClothesQueryUseCase.getMemberClosetClothes(
			myId,
			targetMemberId,
			categoryId,
			cursor,
			size
		);

		return ResponseWrapperFactory.toPageResponseEntity(HttpStatus.OK, result);
	}
}

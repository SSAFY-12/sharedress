package com.ssafy.sharedress.adapter.closet.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.closet.dto.ClosetClothesDetailResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesUpdateRequest;
import com.ssafy.sharedress.application.closet.usecase.ClosetClothesQueryUseCase;
import com.ssafy.sharedress.application.closet.usecase.ClosetClothesUseCase;
import com.ssafy.sharedress.application.clothes.dto.AddLibraryClothesToClosetRequest;
import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryRequest;
import com.ssafy.sharedress.global.dto.CursorPageResult;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ClosetClothesController {

	private final ClosetClothesQueryUseCase closetClothesQueryUseCase;
	private final ClosetClothesUseCase closetClothesUseCase;

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

	@GetMapping("/closet/clothes/{closetClothesId}")
	public ResponseEntity<ResponseWrapper<ClosetClothesDetailResponse>> getClosetClothesDetail(
		@PathVariable("closetClothesId") Long closetClothesId
	) {
		// TODO[준]: security context 에서 myId 가져오기
		Long myId = 1L;
		ClosetClothesDetailResponse result = closetClothesQueryUseCase.getClosetClothesDetail(myId, closetClothesId);

		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}

	@PutMapping("/closet/clothes/{closetClothesId}")
	public ResponseEntity<ResponseWrapper<ClosetClothesDetailResponse>> updateClosetClothes(
		@PathVariable("closetClothesId") Long closetClothesId,
		@RequestBody ClosetClothesUpdateRequest request
	) {
		// TODO[준]: security context 에서 myId 가져오기
		Long myId = 1L;
		ClosetClothesDetailResponse result = closetClothesUseCase.updateClosetClothes(myId, closetClothesId, request);

		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}

	@DeleteMapping("/closet/clothes/{closetClothesId}")
	public ResponseEntity<ResponseWrapper<Void>> removeClosetClothes(
		@PathVariable("closetClothesId") Long closetClothesId
	) {
		// TODO[준]: security context 에서 myId 가져오기
		Long myId = 1L;
		closetClothesUseCase.removeClosetClothes(myId, closetClothesId);

		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}

	@PostMapping("/closet/clothes/library")
	public ResponseEntity<ResponseWrapper<Void>> addClothesToCloset(
		@RequestBody AddLibraryClothesToClosetRequest request
	) {
		Long myId = 1L; // TODO: 시큐리티 컨텍스트에서 추출 예정
		closetClothesUseCase.addLibraryClothesToCloset(request.itemsId(), myId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@PostMapping("/closet/clothes/purchase-history")
	public ResponseEntity<ResponseWrapper<Void>> registerClothesFromPurchase(
		@RequestBody PurchaseHistoryRequest request) {

		// TODO[지윤]: security context에서 memberId를 가져오는 로직 추가
		Long myId = 1L;
		closetClothesUseCase.registerClothesFromPurchase(request, myId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.ACCEPTED, null);
	}
}

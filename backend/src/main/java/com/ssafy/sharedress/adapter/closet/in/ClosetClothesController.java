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
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sharedress.application.closet.dto.ClosetClothesDetailResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesIdResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesUpdateRequest;
import com.ssafy.sharedress.application.closet.usecase.ClosetClothesQueryUseCase;
import com.ssafy.sharedress.application.closet.usecase.ClosetClothesUseCase;
import com.ssafy.sharedress.application.clothes.dto.AddLibraryClothesToClosetRequest;
import com.ssafy.sharedress.application.clothes.dto.ClothesPhotoDetailRequest;
import com.ssafy.sharedress.application.clothes.dto.ClothesPhotoDetailResponse;
import com.ssafy.sharedress.application.clothes.dto.ClothesPhotoUploadResponse;
import com.ssafy.sharedress.application.guest.annotation.CurrentGuest;
import com.ssafy.sharedress.application.member.annotation.CurrentMember;
import com.ssafy.sharedress.domain.common.context.UserContext;
import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.member.entity.Member;
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
		@CurrentMember(required = false) Member member,
		@CurrentGuest(required = false) Guest guest,
		@PathVariable("memberId") Long targetMemberId,
		@RequestParam(required = false) Long categoryId,
		@RequestParam(required = false) Long cursor,
		@RequestParam(defaultValue = "20") int size
	) {
		UserContext userContext = new UserContext(member, guest);
		CursorPageResult<ClosetClothesResponse> result = closetClothesQueryUseCase.getMemberClosetClothes(
			userContext,
			targetMemberId,
			categoryId,
			cursor,
			size
		);

		return ResponseWrapperFactory.toPageResponseEntity(HttpStatus.OK, result);
	}

	@GetMapping("/closet/clothes/{closetClothesId}")
	public ResponseEntity<ResponseWrapper<ClosetClothesDetailResponse>> getClosetClothesDetail(
		@PathVariable("closetClothesId") Long closetClothesId,
		@CurrentMember(required = false) Member member,
		@CurrentGuest(required = false) Guest guest
	) {
		UserContext userContext = new UserContext(member, guest);
		ClosetClothesDetailResponse result = closetClothesQueryUseCase.getClosetClothesDetail(userContext.getId(),
			closetClothesId);

		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}

	@PutMapping("/closet/clothes/{closetClothesId}")
	public ResponseEntity<ResponseWrapper<ClosetClothesDetailResponse>> updateClosetClothes(
		@PathVariable("closetClothesId") Long closetClothesId,
		@RequestBody ClosetClothesUpdateRequest request,
		@CurrentMember Member member
	) {
		ClosetClothesDetailResponse result = closetClothesUseCase.updateClosetClothes(member.getId(), closetClothesId,
			request);

		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}

	@DeleteMapping("/closet/clothes/{closetClothesId}")
	public ResponseEntity<ResponseWrapper<Void>> removeClosetClothes(
		@PathVariable("closetClothesId") Long closetClothesId,
		@CurrentMember Member member
	) {
		closetClothesUseCase.removeClosetClothes(member.getId(), closetClothesId);

		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}

	@PostMapping("/closet/clothes/library")
	public ResponseEntity<ResponseWrapper<Long>> addClothesToCloset(
		@RequestBody AddLibraryClothesToClosetRequest request,
		@CurrentMember Member member
	) {
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED,
			closetClothesUseCase.addLibraryClothesToCloset(request.itemId(), member.getId())
		);
	}

	@GetMapping("/closet/my")
	public ResponseEntity<ResponseWrapper<List<ClosetClothesIdResponse>>> getMyClosetClothesIds(
		@CurrentMember Member member
	) {
		return ResponseWrapperFactory.toResponseEntity(
			HttpStatus.OK,
			closetClothesQueryUseCase.getMyClosetClothesIds(member.getId())
		);
	}

	@PostMapping("/closet/clothes/photos/upload")
	public ResponseEntity<ResponseWrapper<List<ClothesPhotoUploadResponse>>> uploadClosetClothesPhotos(
		@CurrentMember Member member,
		@RequestParam("photos") List<MultipartFile> photos
	) {
		List<ClothesPhotoUploadResponse> result = closetClothesUseCase.uploadClosetClothesPhotos(
			member.getId(),
			photos
		);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, result);
	}

	@PostMapping("/closet/clothes/photos/detail")
	public ResponseEntity<ResponseWrapper<ClothesPhotoDetailResponse>> getClosetClothesDetailByPhoto(
		@CurrentMember Member member,
		@RequestBody List<ClothesPhotoDetailRequest> request
	) {
		ClothesPhotoDetailResponse result = closetClothesUseCase.registerClothesFromPhotos(member.getId(), request);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.ACCEPTED, result);
	}

}

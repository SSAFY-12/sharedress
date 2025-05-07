package com.ssafy.sharedress.adapter.coordination.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sharedress.application.coordination.dto.CoordinationDetailResponse;
import com.ssafy.sharedress.application.coordination.dto.CoordinationRequestDto;
import com.ssafy.sharedress.application.coordination.dto.CoordinationRequestRequest;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;
import com.ssafy.sharedress.application.coordination.dto.CoordinationWithItemResponse;
import com.ssafy.sharedress.application.coordination.dto.Scope;
import com.ssafy.sharedress.application.coordination.dto.UpdateCoordinationIsPublicRequest;
import com.ssafy.sharedress.application.coordination.dto.UpdateCoordinationThumbnailResponse;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationQueryUseCase;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationRequestUseCase;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CoordinationController {

	private final CoordinationUseCase coordinationUseCase;
	private final CoordinationQueryUseCase coordinationQueryUseCase;
	private final CoordinationRequestUseCase coordinationRequestUseCase;

	@PostMapping("/coordinations/my")
	public ResponseEntity<ResponseWrapper<CoordinationResponse>> saveMyCoordination(
		@RequestBody CoordinationRequestDto request
	) {
		Long myId = 1L; // TODO[준]: security context 에서 myId 가져오기
		CoordinationResponse response = coordinationUseCase.saveMyCoordination(myId, request);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, response);
	}

	@PostMapping("/coordinations/friends/{memberId}")
	public ResponseEntity<ResponseWrapper<CoordinationResponse>> recommendCoordination(
		@PathVariable("memberId") Long memberId,
		@RequestBody CoordinationRequestDto request
	) {
		Long myId = 2L; // TODO[준]: security context 에서 myId 가져오기
		CoordinationResponse response = coordinationUseCase.recommendCoordination(
			myId,
			memberId,
			request
		);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, response);
	}

	@GetMapping("/coordinations")
	public ResponseEntity<ResponseWrapper<List<CoordinationWithItemResponse>>> getCoordinations(
		@RequestParam(name = "memberId") Long memberId,
		@RequestParam(name = "scope", defaultValue = "CREATED") Scope scope
	) {
		Long myId = 1L; // TODO[준]: security context 에서 myId 가져오기
		List<CoordinationWithItemResponse> response = coordinationQueryUseCase.getCoordinations(myId, memberId, scope);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, response);
	}

	@GetMapping("/coordinations/{coordinationId}")
	public ResponseEntity<ResponseWrapper<CoordinationDetailResponse>> getCoordinationDetail(
		@PathVariable("coordinationId") Long coordinationId
	) {
		Long myId = 1L; // TODO[준]: security context 에서 myId 가져오기
		CoordinationDetailResponse response = coordinationQueryUseCase.getCoordinationDetail(myId, coordinationId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, response);
	}

	@PostMapping("/coordinations/request")
	public ResponseEntity<ResponseWrapper<Void>> sendCoordinationRequest(
		@RequestBody CoordinationRequestRequest request
	) {
		Long myId = 1L; // TODO[준]: security context 에서 myId 가져오기
		coordinationRequestUseCase.sendCoordinationRequest(myId, request);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@PostMapping("/coordinations/{coordinationId}/copy")
	public ResponseEntity<ResponseWrapper<CoordinationResponse>> copyCoordination(
		@PathVariable("coordinationId") Long coordinationId
	) {
		Long myId = 1L; // TODO[준]: security context 에서 myId 가져오기
		CoordinationResponse response = coordinationUseCase.copyCoordination(myId, coordinationId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, response);
	}

	@PatchMapping("/coordinations/{coordinationId}/thumbnail")
	public ResponseEntity<ResponseWrapper<UpdateCoordinationThumbnailResponse>> updateCoordinationThumbnail(
		@PathVariable("coordinationId") Long coordinationId,
		@RequestPart("thumbnail") MultipartFile thumbnail
	) {
		Long myId = 1L; // TODO[준]: security context 에서 myId 가져오기
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK,
			coordinationUseCase.updateThumbnail(thumbnail, coordinationId));
	}

	@PatchMapping("/coordinations/{coordinationId}")
	public ResponseEntity<ResponseWrapper<CoordinationResponse>> updateCoordinationIsPublic(
		@PathVariable("coordinationId") Long coordinationId,
		@RequestBody UpdateCoordinationIsPublicRequest request
	) {
		Long myId = 1L; // TODO[준]: security context 에서 myId 가져오기
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK,
			coordinationUseCase.updateIsPublic(myId, coordinationId, request));
	}

	@DeleteMapping("/coordinations/{coordinationId}")
	public ResponseEntity<ResponseWrapper<Void>> removeCoordination(
		@PathVariable("coordinationId") Long coordinationId
	) {
		Long myId = 1L; // TODO[준]: security context 에서 myId 가져오기
		coordinationUseCase.removeCoordination(myId, coordinationId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}
}

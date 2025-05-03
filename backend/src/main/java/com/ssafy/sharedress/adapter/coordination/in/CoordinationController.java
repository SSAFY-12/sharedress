package com.ssafy.sharedress.adapter.coordination.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequest;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;
import com.ssafy.sharedress.application.coordination.dto.CoordinationWithItemResponse;
import com.ssafy.sharedress.application.coordination.dto.Scope;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationQueryUseCase;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CoordinationController {

	private final CoordinationUseCase coordinationUseCase;
	private final CoordinationQueryUseCase coordinationQueryUseCase;

	@PostMapping("/coordinations/my")
	public ResponseEntity<ResponseWrapper<CoordinationResponse>> saveMyCoordination(
		@RequestBody CoordinationRequest coordinationRequest
	) {
		Long myId = 1L; // TODO[준]: security context 에서 myId 가져오기
		CoordinationResponse response = coordinationUseCase.saveMyCoordination(myId, coordinationRequest);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, response);
	}

	@PostMapping("/coordinations/friends/{memberId}")
	public ResponseEntity<ResponseWrapper<CoordinationResponse>> recommendCoordination(
		@PathVariable("memberId") Long memberId,
		@RequestBody CoordinationRequest coordinationRequest
	) {
		Long myId = 1L; // TODO[준]: security context 에서 myId 가져오기
		CoordinationResponse response = coordinationUseCase.recommendCoordination(myId, memberId, coordinationRequest);
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
}

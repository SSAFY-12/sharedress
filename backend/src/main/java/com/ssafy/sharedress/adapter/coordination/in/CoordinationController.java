package com.ssafy.sharedress.adapter.coordination.in;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequest;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CoordinationController {

	private final CoordinationUseCase coordinationUseCase;

	@PostMapping("/coordinations/my")
	public ResponseEntity<ResponseWrapper<CoordinationResponse>> saveMyCoordination(
		@RequestBody CoordinationRequest coordinationRequest
	) {
		Long myId = 1L; // TODO[준]: security context 에서 myId 가져오기
		CoordinationResponse response = coordinationUseCase.saveMyCoordination(myId, coordinationRequest);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, response);
	}
}

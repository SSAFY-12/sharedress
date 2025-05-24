package com.ssafy.sharedress.adapter.admin.in;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.admin.usecase.AdminUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AdminController {

	private final AdminUseCase adminUseCase;

	@PostMapping("/admin")
	public ResponseEntity<ResponseWrapper<Void>> runDemoPurchaseScanFlow(
	) {
		// TODO[지윤]: 146 멤버만
		// Long memberId = 146L;
		Long memberId = 45L;
		adminUseCase.runDemoPurchaseScanFlow(memberId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}
}

package com.ssafy.sharedress.adapter.admin.in;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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

	// 구매내역 스캔 AI 처리 완료를 위한 임시 API
	@PostMapping("/admin")
	public ResponseEntity<ResponseWrapper<Void>> runDemoPurchaseScanFlow() {
		// TODO[지윤]: 146 멤버만
		Long memberId = 146L;
		adminUseCase.runDemoPurchaseScanFlow(memberId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}

	// 146 옷장의 옷을 초기화하는 임시 API
	@DeleteMapping("/admin/closet-clothes")
	public ResponseEntity<ResponseWrapper<Void>> deleteAllClosetClothesForDemo() {
		// TODO[지윤]: 146 멤버만
		Long memberId = 146L;
		adminUseCase.deleteAllClosetClothes(memberId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}

	// 146 친구 목록을 초기화하는 임시 API
	@DeleteMapping("/admin/friends")
	public ResponseEntity<ResponseWrapper<Void>> deleteAllFriendsForDemo() {
		Long memberId = 146L;
		adminUseCase.deleteAllFriends(memberId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}

	@PostMapping("/admin/photo")
	public ResponseEntity<ResponseWrapper<Void>> runDemoPhotoFlow() {
		Long memberId = 148L;
		adminUseCase.runDemoPhotoFlow(memberId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}
}

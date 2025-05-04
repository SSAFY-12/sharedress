package com.ssafy.sharedress.adapter.friend.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.friend.dto.FriendRequestDto;
import com.ssafy.sharedress.application.friend.dto.FriendRequestResponse;
import com.ssafy.sharedress.application.friend.usecase.FriendRequestQueryUseCase;
import com.ssafy.sharedress.application.friend.usecase.FriendRequestUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FriendController {

	private final FriendRequestUseCase friendRequestUseCase;
	private final FriendRequestQueryUseCase friendRequestQueryUseCase;

	@PostMapping("/friends/request")
	public ResponseEntity<ResponseWrapper<Void>> sendFriendRequest(
		@RequestBody FriendRequestDto friendRequestDto
	) {
		// TODO[준]: SecurityContextHolder에서 memberId 가져오기
		Long myId = 1L;
		friendRequestUseCase.sendFriendRequest(myId, friendRequestDto);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@PostMapping("/friends/request/{requestId}/accept")
	public ResponseEntity<ResponseWrapper<Void>> acceptFriendRequest(
		@PathVariable("requestId") Long requestId
	) {
		// TODO[준]: SecurityContextHolder에서 memberId 가져오기
		Long myId = 1L;
		friendRequestUseCase.acceptFriendRequest(myId, requestId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@PostMapping("/friends/request/{requestId}/reject")
	public ResponseEntity<ResponseWrapper<Void>> rejectFriendRequest(
		@PathVariable("requestId") Long requestId
	) {
		// TODO[준]: SecurityContextHolder에서 memberId 가져오기
		Long myId = 1L;
		friendRequestUseCase.rejectFriendRequest(myId, requestId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@PostMapping("/friends/request/{requestId}/cancel")
	public ResponseEntity<ResponseWrapper<Void>> cancelFriendRequest(
		@PathVariable("requestId") Long requestId
	) {
		// TODO[준]: SecurityContextHolder에서 memberId 가져오기
		Long myId = 1L;
		friendRequestUseCase.cancelFriendRequest(myId, requestId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@GetMapping("/friends/request")
	public ResponseEntity<ResponseWrapper<List<FriendRequestResponse>>> getFriendRequestList() {
		// TODO[준]: SecurityContextHolder에서 memberId 가져오기
		Long myId = 1L;
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK,
			friendRequestQueryUseCase.getFriendRequestList(myId));
	}
}

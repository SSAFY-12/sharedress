package com.ssafy.sharedress.adapter.friend.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.auth.dto.CustomMemberDetails;
import com.ssafy.sharedress.application.friend.dto.FriendRequestDto;
import com.ssafy.sharedress.application.friend.dto.FriendRequestResponse;
import com.ssafy.sharedress.application.friend.dto.FriendResponse;
import com.ssafy.sharedress.application.friend.usecase.FriendQueryUseCase;
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
	private final FriendQueryUseCase friendQueryUseCase;

	@PostMapping("/friends/request")
	public ResponseEntity<ResponseWrapper<Void>> sendFriendRequest(
		@AuthenticationPrincipal CustomMemberDetails memberDetails,
		@RequestBody FriendRequestDto friendRequestDto
	) {
		Long myId = memberDetails.member().getId();
		friendRequestUseCase.sendFriendRequest(myId, friendRequestDto);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@PostMapping("/friends/request/{requestId}/accept")
	public ResponseEntity<ResponseWrapper<Void>> acceptFriendRequest(
		@AuthenticationPrincipal CustomMemberDetails memberDetails,
		@PathVariable("requestId") Long requestId
	) {
		Long myId = memberDetails.member().getId();
		friendRequestUseCase.acceptFriendRequest(myId, requestId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@PostMapping("/friends/request/{requestId}/reject")
	public ResponseEntity<ResponseWrapper<Void>> rejectFriendRequest(
		@AuthenticationPrincipal CustomMemberDetails memberDetails,
		@PathVariable("requestId") Long requestId
	) {
		Long myId = memberDetails.member().getId();
		friendRequestUseCase.rejectFriendRequest(myId, requestId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@PostMapping("/friends/request/{requestId}/cancel")
	public ResponseEntity<ResponseWrapper<Void>> cancelFriendRequest(
		@AuthenticationPrincipal CustomMemberDetails memberDetails,
		@PathVariable("requestId") Long requestId
	) {
		Long myId = memberDetails.member().getId();
		friendRequestUseCase.cancelFriendRequest(myId, requestId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@GetMapping("/friends/request")
	public ResponseEntity<ResponseWrapper<List<FriendRequestResponse>>> getFriendRequestList(
		@AuthenticationPrincipal CustomMemberDetails memberDetails
	) {
		Long myId = memberDetails.member().getId();
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK,
			friendRequestQueryUseCase.getFriendRequestList(myId));
	}

	@GetMapping("/friends")
	public ResponseEntity<ResponseWrapper<List<FriendResponse>>> getFriendList(
		@AuthenticationPrincipal CustomMemberDetails memberDetails
	) {
		Long myId = memberDetails.member().getId();
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK,
			friendQueryUseCase.getFriendList(myId));
	}

	@GetMapping("/friends/search")
	public ResponseEntity<ResponseWrapper<List<FriendResponse>>> getFriendListByKeyword(
		@AuthenticationPrincipal CustomMemberDetails memberDetails,
		@RequestParam(required = false, defaultValue = "") String keyword
	) {
		Long myId = memberDetails.member().getId();
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK,
			friendQueryUseCase.getFriendListByKeyword(myId, keyword));
	}
}

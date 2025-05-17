package com.ssafy.sharedress.adapter.friend.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.friend.dto.FriendRequestDto;
import com.ssafy.sharedress.application.friend.dto.FriendRequestResponse;
import com.ssafy.sharedress.application.friend.dto.FriendResponse;
import com.ssafy.sharedress.application.friend.usecase.FriendQueryUseCase;
import com.ssafy.sharedress.application.friend.usecase.FriendRequestQueryUseCase;
import com.ssafy.sharedress.application.friend.usecase.FriendRequestUseCase;
import com.ssafy.sharedress.application.member.annotation.CurrentMember;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FriendController {

	private final FriendRequestUseCase friendRequestUseCase;
	private final FriendRequestQueryUseCase friendRequestQueryUseCase;
	private final FriendQueryUseCase friendQueryUseCase;

	@PostMapping("/friends/request")
	public ResponseEntity<ResponseWrapper<Void>> sendFriendRequest(
		@CurrentMember Member member,
		@Valid @RequestBody FriendRequestDto request
	) {
		Long myId = member.getId();
		friendRequestUseCase.sendFriendRequest(myId, request);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@PostMapping("/friends/request/{requestId}/accept")
	public ResponseEntity<ResponseWrapper<Void>> acceptFriendRequest(
		@CurrentMember Member member,
		@PathVariable("requestId") Long requestId
	) {
		Long myId = member.getId();
		friendRequestUseCase.acceptFriendRequest(myId, requestId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@PostMapping("/friends/request/{requestId}/reject")
	public ResponseEntity<ResponseWrapper<Void>> rejectFriendRequest(
		@CurrentMember Member member,
		@PathVariable("requestId") Long requestId
	) {
		Long myId = member.getId();
		friendRequestUseCase.rejectFriendRequest(myId, requestId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@PostMapping("/friends/request/{requestId}/cancel")
	public ResponseEntity<ResponseWrapper<Void>> cancelFriendRequest(
		@CurrentMember Member member,
		@PathVariable("requestId") Long requestId
	) {
		Long myId = member.getId();
		friendRequestUseCase.cancelFriendRequest(myId, requestId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}

	@GetMapping("/friends/request")
	public ResponseEntity<ResponseWrapper<List<FriendRequestResponse>>> getFriendRequestList(
		@CurrentMember Member member
	) {
		Long myId = member.getId();
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK,
			friendRequestQueryUseCase.getFriendRequestList(myId));
	}

	@GetMapping("/friends")
	public ResponseEntity<ResponseWrapper<List<FriendResponse>>> getFriendList(
		@CurrentMember Member member
	) {
		Long myId = member.getId();
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK,
			friendQueryUseCase.getFriendList(myId));
	}

	@GetMapping("/friends/search")
	public ResponseEntity<ResponseWrapper<List<FriendResponse>>> getFriendListByKeyword(
		@CurrentMember Member member,
		@RequestParam(required = false, defaultValue = "") String keyword
	) {
		Long myId = member.getId();
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK,
			friendQueryUseCase.getFriendListByKeyword(myId, keyword));
	}

	@GetMapping("/friends/{friendId}/request")
	public ResponseEntity<ResponseWrapper<FriendRequestResponse>> sendFriendRequestToFriend(
		@CurrentMember Member member,
		@PathVariable("friendId") Long friendId
	) {
		Long myId = member.getId();
		return ResponseWrapperFactory.toResponseEntity(
			HttpStatus.CREATED,
			friendRequestQueryUseCase.getFriendRequest(myId, friendId)
		);
	}
}

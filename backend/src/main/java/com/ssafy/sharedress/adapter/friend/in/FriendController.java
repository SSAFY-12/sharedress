package com.ssafy.sharedress.adapter.friend.in;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.friend.dto.FriendRequestDto;
import com.ssafy.sharedress.application.friend.usecase.FriendRequestUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FriendController {

	private final FriendRequestUseCase friendRequestUseCase;

	@PostMapping("/friends/request")
	public ResponseEntity<ResponseWrapper<Void>> sendFriendRequest(
		@RequestBody FriendRequestDto friendRequestDto
	) {
		// TODO[준]: SecurityContextHolder에서 memberId 가져오기
		Long myId = 1L;
		friendRequestUseCase.sendFriendRequest(myId, friendRequestDto);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, null);
	}
}

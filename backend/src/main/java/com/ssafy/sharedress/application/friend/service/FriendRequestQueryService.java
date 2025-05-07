package com.ssafy.sharedress.application.friend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.friend.dto.FriendRequestResponse;
import com.ssafy.sharedress.application.friend.usecase.FriendRequestQueryUseCase;
import com.ssafy.sharedress.domain.friend.error.FriendRequestErrorCode;
import com.ssafy.sharedress.domain.friend.repository.FriendRequestRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class FriendRequestQueryService implements FriendRequestQueryUseCase {

	private final FriendRequestRepository friendRequestRepository;

	@Override
	public List<FriendRequestResponse> getFriendRequestList(Long memberId) {
		return friendRequestRepository.findAllByReceiverId(memberId)
			.stream()
			.map(FriendRequestResponse::fromEntity)
			.toList();
	}

	@Override
	public FriendRequestResponse getFriendRequest(Long memberId, Long friendId) {
		return friendRequestRepository.findByMemberId(memberId, friendId)
			.map(FriendRequestResponse::fromEntity)
			.orElseThrow(ExceptionUtil.exceptionSupplier(FriendRequestErrorCode.FRIEND_REQUEST_NOT_FOUND));
	}
}

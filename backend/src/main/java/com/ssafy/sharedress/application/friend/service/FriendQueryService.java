package com.ssafy.sharedress.application.friend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.friend.dto.FriendResponse;
import com.ssafy.sharedress.application.friend.dto.FriendsWithHasRequestResponse;
import com.ssafy.sharedress.application.friend.usecase.FriendQueryUseCase;
import com.ssafy.sharedress.domain.friend.repository.FriendRepository;
import com.ssafy.sharedress.domain.friend.repository.FriendRequestRepository;

import lombok.RequiredArgsConstructor;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class FriendQueryService implements FriendQueryUseCase {

	private final FriendRepository friendRepository;
	private final FriendRequestRepository friendRequestRepository;

	@Override
	public List<FriendResponse> getFriendList(Long memberId) {
		return friendRepository.findAllByMemberId(memberId)
			.stream()
			.map(friend -> FriendResponse.fromEntity(friend, memberId))
			.toList();
	}

	@Override
	public List<FriendResponse> getFriendListByKeyword(Long memberId, String keyword) {
		return friendRepository.findByKeyword(memberId, keyword)
			.stream()
			.map(friend -> FriendResponse.fromEntity(friend, memberId))
			.toList();
	}

	@Override
	public FriendsWithHasRequestResponse getFriendsWithHasRequest(Long memberId) {
		List<FriendResponse> items = friendRepository.findAllByMemberId(memberId)
			.stream()
			.map(friend -> FriendResponse.fromEntity(friend, memberId))
			.toList();

		Boolean hasRequest = friendRequestRepository.existsByReceiverId(memberId);
		return new FriendsWithHasRequestResponse(items, hasRequest);
	}
}

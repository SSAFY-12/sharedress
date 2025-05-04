package com.ssafy.sharedress.application.friend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.friend.dto.FriendResponse;
import com.ssafy.sharedress.application.friend.usecase.FriendQueryUseCase;
import com.ssafy.sharedress.domain.friend.repository.FriendRepository;

import lombok.RequiredArgsConstructor;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class FriendQueryService implements FriendQueryUseCase {

	private final FriendRepository friendRepository;

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
}

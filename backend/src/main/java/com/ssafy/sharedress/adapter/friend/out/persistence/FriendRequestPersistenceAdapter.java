package com.ssafy.sharedress.adapter.friend.out.persistence;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.friend.entity.FriendRequest;
import com.ssafy.sharedress.domain.friend.repository.FriendRequestRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FriendRequestPersistenceAdapter implements FriendRequestRepository {
	private final FriendRequestJpaRepository friendRequestJpaRepository;

	@Override
	public void save(FriendRequest friendRequest) {
		friendRequestJpaRepository.save(friendRequest);
	}

	@Override
	public Boolean existsByMemberId(Long requesterId, Long receiverId) {
		return friendRequestJpaRepository.existsByRequester_IdAndReceiver_Id(requesterId, receiverId);
	}
}

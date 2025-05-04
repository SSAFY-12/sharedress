package com.ssafy.sharedress.adapter.friend.out.persistence;

import java.util.Optional;

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

	@Override
	public void deleteById(Long id) {
		friendRequestJpaRepository.deleteById(id);
	}

	@Override
	public Optional<FriendRequest> findByIdAndReceiverId(Long id, Long receiverId) {
		return friendRequestJpaRepository.findByIdAndReceiverId(id, receiverId);
	}

	@Override
	public Optional<FriendRequest> findByIdAndRequesterId(Long id, Long requesterId) {
		return friendRequestJpaRepository.findByIdAndRequesterId(id, requesterId);
	}
}

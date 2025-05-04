package com.ssafy.sharedress.domain.friend.repository;

import java.util.Optional;

import com.ssafy.sharedress.domain.friend.entity.FriendRequest;

public interface FriendRequestRepository {
	void save(FriendRequest friendRequest);

	Boolean existsByMemberId(Long requesterId, Long receiverId);

	void deleteById(Long id);

	Optional<FriendRequest> findByIdAndReceiverId(Long id, Long receiverId);

	Optional<FriendRequest> findByIdAndRequesterId(Long id, Long requesterId);
}

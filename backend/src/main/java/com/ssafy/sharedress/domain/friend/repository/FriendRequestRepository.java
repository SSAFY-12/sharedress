package com.ssafy.sharedress.domain.friend.repository;

import com.ssafy.sharedress.domain.friend.entity.FriendRequest;

public interface FriendRequestRepository {
	void save(FriendRequest friendRequest);

	Boolean existsByMemberId(Long requesterId, Long receiverId);
}

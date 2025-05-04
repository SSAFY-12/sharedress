package com.ssafy.sharedress.domain.friend.repository;

import com.ssafy.sharedress.domain.friend.entity.Friend;

public interface FriendRepository {
	void save(Friend friend);

	Boolean existsByMemberId(Long memberAId, Long memberBId);
}

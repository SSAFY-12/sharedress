package com.ssafy.sharedress.domain.friend.repository;

import java.util.List;

import com.ssafy.sharedress.domain.friend.entity.Friend;

public interface FriendRepository {
	void save(Friend friend);

	Boolean existsByMemberId(Long memberAId, Long memberBId);

	List<Friend> findAllByMemberId(Long memberId);

	List<Friend> findByKeyword(Long memberId, String keyword);
}

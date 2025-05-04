package com.ssafy.sharedress.adapter.friend.out.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.friend.entity.Friend;
import com.ssafy.sharedress.domain.friend.repository.FriendRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FriendPersistenceAdapter implements FriendRepository {
	private final FriendJpaRepository friendJpaRepository;

	@Override
	public void save(Friend friend) {
		friendJpaRepository.save(friend);
	}

	@Override
	public Boolean existsByMemberId(Long memberAId, Long memberBId) {
		return friendJpaRepository.existsByMemberA_IdAndMemberB_Id(memberAId, memberBId);
	}

	@Override
	public List<Friend> findAllByMemberId(Long memberId) {
		return friendJpaRepository.findAllByMemberId(memberId);
	}
}

package com.ssafy.sharedress.adapter.friend.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.sharedress.domain.friend.entity.Friend;

public interface FriendJpaRepository extends JpaRepository<Friend, Long> {
	@Query("SELECT CASE WHEN COUNT(f) > 0 THEN TRUE ELSE FALSE END FROM Friend f "
		+ "WHERE (f.memberA.id = :memberAId AND f.memberB.id = :memberBId) "
		+ "OR (f.memberA.id = :memberBId AND f.memberB.id = :memberAId)")
	Boolean existsByMemberA_IdAndMemberB_Id(Long memberAId, Long memberBId);
}

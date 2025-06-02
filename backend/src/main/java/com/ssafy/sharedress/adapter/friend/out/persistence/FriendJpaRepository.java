package com.ssafy.sharedress.adapter.friend.out.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.sharedress.domain.friend.entity.Friend;

public interface FriendJpaRepository extends JpaRepository<Friend, Long> {
	@Query("SELECT CASE WHEN COUNT(f) > 0 THEN TRUE ELSE FALSE END FROM Friend f "
		+ "WHERE (f.memberA.id = :memberAId AND f.memberB.id = :memberBId) "
		+ "OR (f.memberA.id = :memberBId AND f.memberB.id = :memberAId)")
	Boolean existsByMemberA_IdAndMemberB_Id(Long memberAId, Long memberBId);

	@Query("SELECT f FROM Friend f "
		+ "JOIN FETCH f.memberA a "
		+ "JOIN FETCH f.memberB b "
		+ "WHERE (f.memberA.id = :memberId OR f.memberB.id = :memberId) "
		+ "ORDER BY f.id DESC")
	List<Friend> findAllByMemberId(Long memberId);

	@Query("SELECT f FROM Friend f "
		+ "JOIN FETCH f.memberA a "
		+ "JOIN FETCH f.memberB b "
		+ "WHERE (f.memberA.id = :memberId AND b.nickname LIKE %:keyword%) "
		+ "OR (f.memberB.id = :memberId AND a.nickname LIKE %:keyword%) "
		+ "ORDER BY f.id DESC")
	List<Friend> findByKeyword(Long memberId, String keyword);

	@Modifying
	@Query("DELETE FROM Friend f "
		+ "WHERE f.memberA.id = :memberId or f.memberB.id = :memberId")
	void deleteAllByMemberId(@Param("memberId") Long memberId);
}

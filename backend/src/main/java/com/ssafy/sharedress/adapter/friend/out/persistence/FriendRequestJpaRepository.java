package com.ssafy.sharedress.adapter.friend.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.sharedress.domain.friend.entity.FriendRequest;

public interface FriendRequestJpaRepository extends JpaRepository<FriendRequest, Long> {
	@Query("SELECT CASE WHEN COUNT(fr) > 0 THEN TRUE ELSE FALSE END FROM FriendRequest fr "
		+ "WHERE fr.requester.id = :requesterId AND fr.receiver.id = :receiverId")
	Boolean existsByRequester_IdAndReceiver_Id(
		@Param("requesterId") Long requesterId,
		@Param("receiverId") Long receiverId
	);
}

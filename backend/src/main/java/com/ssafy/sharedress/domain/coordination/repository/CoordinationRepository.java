package com.ssafy.sharedress.domain.coordination.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.sharedress.domain.coordination.entity.Coordination;

public interface CoordinationRepository {
	Coordination save(Coordination coordination);

	List<Coordination> findMyCoordinations(Long myId);

	List<Coordination> findMyRecommendedCoordinations(Long myId);

	List<Coordination> findFriendCoordinations(Long friendId);

	List<Coordination> findMyRecommendToFriend(Long myId, Long friendId);

	Optional<Coordination> findByIdWithOwnerAndOriginCreator(Long id);

	Optional<Coordination> findById(Long id);
}

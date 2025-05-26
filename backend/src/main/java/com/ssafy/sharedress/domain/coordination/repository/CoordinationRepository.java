package com.ssafy.sharedress.domain.coordination.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.sharedress.domain.coordination.entity.Coordination;

public interface CoordinationRepository {
	Coordination save(Coordination coordination);

	List<Coordination> findMyCoordinations(Long myId);

	List<Coordination> findMyRecommendedCoordinations(Long myId);

	List<Coordination> findFriendCoordinations(Long friendId);

	List<Coordination> findUserRecommendToFriend(Long userId, Long friendId, boolean isMember);

	Optional<Coordination> findByIdWithOwnerAndOriginCreator(Long id);

	Optional<Coordination> findById(Long id);

	void deleteById(Long id);

	List<Coordination> findFriendCoordinationRecommendedByMe(Long myId, Long friendId);

	void delete(Coordination coordination);
}

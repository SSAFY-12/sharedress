package com.ssafy.sharedress.application.coordination.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.coordination.dto.CoordinationWithItemResponse;
import com.ssafy.sharedress.application.coordination.dto.Scope;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationQueryUseCase;
import com.ssafy.sharedress.domain.coordination.entity.Coordination;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRepository;

import lombok.RequiredArgsConstructor;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class CoordinationQueryService implements CoordinationQueryUseCase {

	private final CoordinationRepository coordinationRepository;

	@Override
	public List<CoordinationWithItemResponse> getCoordinations(Long myId, Long targetMemberId, Scope scope) {
		if (Objects.equals(myId, targetMemberId) && scope == Scope.CREATED) {
			List<Coordination> myCoordinations = coordinationRepository.findMyCoordinations(myId);
			return myCoordinations.stream()
				.map(CoordinationWithItemResponse::fromEntity)
				.toList();
		} else if (Objects.equals(myId, targetMemberId) && scope == Scope.RECOMMENDED) {
			List<Coordination> myRecommendedCoordinations = coordinationRepository.findMyRecommendedCoordinations(myId);
			return myRecommendedCoordinations.stream()
				.map(CoordinationWithItemResponse::fromEntity)
				.toList();
		} else if (scope == Scope.CREATED) {
			List<Coordination> friendCoordinations = coordinationRepository.findFriendCoordinations(targetMemberId);
			return friendCoordinations.stream()
				.map(CoordinationWithItemResponse::fromEntity)
				.toList();
		} else if (scope == Scope.RECOMMENDED) {
			List<Coordination> myRecommendToFriend = coordinationRepository.findMyRecommendToFriend(myId,
				targetMemberId);
			return myRecommendToFriend.stream()
				.map(CoordinationWithItemResponse::fromEntity)
				.toList();
		}
		throw new IllegalArgumentException("Invalid scope: " + scope);
	}

}

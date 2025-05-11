package com.ssafy.sharedress.application.coordination.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.coordination.dto.CoordinationDetailResponse;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;
import com.ssafy.sharedress.application.coordination.dto.CoordinationWithItemResponse;
import com.ssafy.sharedress.application.coordination.dto.Scope;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationQueryUseCase;
import com.ssafy.sharedress.domain.common.context.UserContext;
import com.ssafy.sharedress.domain.common.context.UserContextErrorCode;
import com.ssafy.sharedress.domain.coordination.entity.Coordination;
import com.ssafy.sharedress.domain.coordination.error.CoordinationErrorCode;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class CoordinationQueryService implements CoordinationQueryUseCase {

	private final CoordinationRepository coordinationRepository;

	@Override
	public List<CoordinationWithItemResponse> getCoordinations(
		UserContext userContext,
		Long targetMemberId,
		Scope scope
	) {
		if (userContext.isMember()) {
			return handleMemberGetCoordinations(userContext.getId(), targetMemberId, scope);
		}

		if (userContext.isGuest()) {
			return handleGuestGetCoordinations(userContext.getId(), targetMemberId, scope);
		}

		ExceptionUtil.throwException(UserContextErrorCode.USER_UNAUTHORIZED);
		return null;
	}

	@Override
	public CoordinationDetailResponse getCoordinationDetail(Long myId, Long coordinationId) {
		return coordinationRepository.findByIdWithOwnerAndOriginCreator(coordinationId)
			.map(CoordinationDetailResponse::fromEntity)
			.orElseThrow(ExceptionUtil.exceptionSupplier(CoordinationErrorCode.COORDINATION_NOT_FOUND));
	}

	@Override
	public List<CoordinationResponse> getFriendCoordinations(Long myId, Long friendId) {
		return coordinationRepository.findFriendCoordinationRecommendedByMe(myId, friendId)
			.stream()
			.map(CoordinationResponse::fromEntity)
			.toList();
	}

	// -- 게스트 -- //
	private List<CoordinationWithItemResponse> handleGuestGetCoordinations(
		Long guestId,
		Long targetMemberId,
		Scope scope
	) {
		// TODO[준]: 게스트가 친구의 코디를 조회할 수 있는지 확인
		if (scope == Scope.CREATED) {
			List<Coordination> friendCoordinations = coordinationRepository.findFriendCoordinations(targetMemberId);
			return friendCoordinations.stream()
				.map(CoordinationWithItemResponse::fromEntity)
				.toList();
		} else if (scope == Scope.RECOMMENDED) {
			List<Coordination> guestRecommendToFriend = coordinationRepository.findUserRecommendToFriend(guestId,
				targetMemberId, false);
			return guestRecommendToFriend.stream()
				.map(CoordinationWithItemResponse::fromEntity)
				.toList();
		}
		// TODO[준]: 예외처리
		return null;
	}

	// -- 멤버 -- //
	private List<CoordinationWithItemResponse> handleMemberGetCoordinations(
		Long memberId,
		Long targetMemberId,
		Scope scope
	) {
		// TODO[준]: memberId와 targetMemberId가 친구인지 확인
		if (Objects.equals(memberId, targetMemberId) && scope == Scope.CREATED) {
			List<Coordination> myCoordinations = coordinationRepository.findMyCoordinations(memberId);
			return myCoordinations.stream()
				.map(CoordinationWithItemResponse::fromEntity)
				.toList();
		} else if (Objects.equals(memberId, targetMemberId) && scope == Scope.RECOMMENDED) {
			List<Coordination> myRecommendedCoordinations = coordinationRepository.findMyRecommendedCoordinations(
				memberId);
			return myRecommendedCoordinations.stream()
				.map(CoordinationWithItemResponse::fromEntity)
				.toList();
		} else if (scope == Scope.CREATED) {
			List<Coordination> friendCoordinations = coordinationRepository.findFriendCoordinations(targetMemberId);
			return friendCoordinations.stream()
				.map(CoordinationWithItemResponse::fromEntity)
				.toList();
		} else if (scope == Scope.RECOMMENDED) {
			List<Coordination> memberRecommendToFriend = coordinationRepository.findUserRecommendToFriend(memberId,
				targetMemberId, true);
			return memberRecommendToFriend.stream()
				.map(CoordinationWithItemResponse::fromEntity)
				.toList();
		}
		// TODO[준]: 예외처리
		return null;
	}
}

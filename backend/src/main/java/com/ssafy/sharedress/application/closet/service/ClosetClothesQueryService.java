package com.ssafy.sharedress.application.closet.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.closet.dto.ClosetClothesDetailResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesResponse;
import com.ssafy.sharedress.application.closet.usecase.ClosetClothesQueryUseCase;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.error.ClosetClothesErrorCode;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.domain.common.context.UserContext;
import com.ssafy.sharedress.global.dto.CursorPageResult;
import com.ssafy.sharedress.global.exception.ExceptionUtil;
import com.ssafy.sharedress.global.response.DefaultResponseCode;

import lombok.RequiredArgsConstructor;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class ClosetClothesQueryService implements ClosetClothesQueryUseCase {

	private final ClosetClothesRepository closetClothesRepository;

	@Override
	public CursorPageResult<ClosetClothesResponse> getMemberClosetClothes(
		UserContext userContext,
		Long targetMemberId,
		Long categoryId,
		Long cursor,
		int size
	) {
		if (userContext.isGuest()) {
			return handleGuestClosetClothes(userContext.getId(), targetMemberId, categoryId, cursor, size);
		}

		if (userContext.isMember()) {
			return handleMemberClosetClothes(userContext.getId(), targetMemberId, categoryId, cursor, size);
		}

		ExceptionUtil.throwException(DefaultResponseCode.UNAUTHORIZED);
		return null;
	}

	@Override
	public ClosetClothesDetailResponse getClosetClothesDetail(Long memberId, Long closetClothesId) {
		// TODO[준]: 검증 로직 필요
		return closetClothesRepository.findById(closetClothesId)
			.map(ClosetClothesDetailResponse::from)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetClothesErrorCode.CLOSET_CLOTHES_NOT_FOUND));
	}

	@Override
	public List<Long> getMyClosetClothesIds(Long myId) {
		return closetClothesRepository.findAllByMemberId(myId);
	}

	// -- 게스트 -- //
	private CursorPageResult<ClosetClothesResponse> handleGuestClosetClothes(
		Long guestId,
		Long targetMemberId,
		Long categoryId,
		Long cursor,
		int size
	) {
		// TODO[준]: guest 가 targetMemberId의 closetClothes 를 볼 수 있는지 확인하는 로직이 필요

		CursorPageResult<ClosetClothes> result = closetClothesRepository.findByMemberAndCategoryWithCursor(
			targetMemberId, categoryId, cursor, size, false
		);

		List<ClosetClothesResponse> contents = result.contents().stream()
			.map(ClosetClothesResponse::from)
			.toList();

		return new CursorPageResult<>(contents, result.hasNext(), result.nextCursor());
	}

	// -- 멤버 -- //
	private CursorPageResult<ClosetClothesResponse> handleMemberClosetClothes(
		Long memberId,
		Long targetMemberId,
		Long categoryId,
		Long cursor,
		int size
	) {
		// TODO[준]: memberId와 targetMemberId가 다를 때, 둘은 친구 관계인지 확인하는 로직이 필요

		CursorPageResult<ClosetClothes> result = closetClothesRepository.findByMemberAndCategoryWithCursor(
			targetMemberId, categoryId, cursor, size, Objects.equals(memberId, targetMemberId)
		);

		List<ClosetClothesResponse> contents = result.contents().stream()
			.map(ClosetClothesResponse::from)
			.toList();

		return new CursorPageResult<>(contents, result.hasNext(), result.nextCursor());
	}
}

package com.ssafy.sharedress.application.closet.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.closet.dto.ClosetClothesDetailResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesResponse;
import com.ssafy.sharedress.application.closet.usecase.ClosetClothesQueryUseCase;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.error.ClosetClothesErrorCode;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.global.dto.CursorPageResult;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class ClosetClothesQueryService implements ClosetClothesQueryUseCase {

	private final ClosetClothesRepository closetClothesRepository;

	@Override
	public CursorPageResult<ClosetClothesResponse> getMemberClosetClothes(
		Long myId,
		Long targetMemberId,
		Long categoryId,
		Long cursor,
		int size
	) {
		// TODO[준]: myId와 targetMemberId가 다를 때, 둘은 친구 관계인지 확인하는 로직이 필요

		CursorPageResult<ClosetClothes> result = closetClothesRepository.findByMemberAndCategoryWithCursor(
			targetMemberId, categoryId, cursor, size
		);

		List<ClosetClothesResponse> contents = result.contents().stream()
			.map(ClosetClothesResponse::from)
			.toList();

		return new CursorPageResult<>(contents, result.hasNext(), result.nextCursor());
	}

	@Override
	public ClosetClothesDetailResponse getClosetClothesDetail(Long memberId, Long closetClothesId) {
		return closetClothesRepository.findById(closetClothesId)
			.map(ClosetClothesDetailResponse::from)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetClothesErrorCode.CLOSET_CLOTHES_NOT_FOUND));
	}
}

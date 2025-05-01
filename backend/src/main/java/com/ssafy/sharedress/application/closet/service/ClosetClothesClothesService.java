package com.ssafy.sharedress.application.closet.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.closet.dto.ClosetClothesResponse;
import com.ssafy.sharedress.application.closet.usecase.ClosetClothesUseCase;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.global.dto.CursorPageResult;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClosetClothesClothesService implements ClosetClothesUseCase {

	private final ClosetClothesRepository closetClothesRepository;

	@Override
	public CursorPageResult<ClosetClothesResponse> getMemberClosetClothes(
		Long myId,
		Long targetMemberId,
		Long categoryId,
		Long cursor,
		int size
	) {
		CursorPageResult<ClosetClothes> result = closetClothesRepository.findByMemberAndCategoryWithCursor(
			targetMemberId, categoryId, cursor, size
		);

		List<ClosetClothesResponse> contents = result.contents().stream()
			.map(ClosetClothesResponse::from)
			.toList();

		return new CursorPageResult<>(contents, result.hasNext(), result.nextCursor());
	}
}

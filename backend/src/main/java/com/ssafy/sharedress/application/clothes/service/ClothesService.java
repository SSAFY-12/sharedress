package com.ssafy.sharedress.application.clothes.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.aop.SendNotification;
import com.ssafy.sharedress.application.clothes.dto.ClothesSearchResponse;
import com.ssafy.sharedress.application.clothes.usecase.ClothesUseCase;
import com.ssafy.sharedress.domain.clothes.repository.ClothesRepository;
import com.ssafy.sharedress.domain.notification.entity.NotificationType;
import com.ssafy.sharedress.global.dto.CursorPageResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClothesService implements ClothesUseCase {

	private final ClothesRepository clothesRepository;

	@Override
	public CursorPageResult<ClothesSearchResponse> getLibraryClothes(
		String keyword,
		Long categoryId,
		Long shopId,
		Long cursorId,
		int size
	) {
		return clothesRepository.searchClothesWithCursor(keyword, categoryId, shopId, cursorId, size);
	}

	@SendNotification(NotificationType.AI_COMPLETE)
	@Override
	public void markClothesAsAiCompleted(Long memberId, String fcmToken) {

	}
}

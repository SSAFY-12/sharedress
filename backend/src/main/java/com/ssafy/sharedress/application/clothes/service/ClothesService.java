package com.ssafy.sharedress.application.clothes.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.aop.SendNotification;
import com.ssafy.sharedress.application.clothes.dto.ClothesSearchResponse;
import com.ssafy.sharedress.application.clothes.usecase.ClothesUseCase;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.domain.clothes.entity.Clothes;
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
	private final ClosetClothesRepository closetClothesRepository;

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
	@Transactional
	@Override
	public void markClothesAsAiCompleted(Long memberId, List<Long> successClothes, List<Long> failClothes) {
		if (successClothes != null && !successClothes.isEmpty()) {
			List<ClosetClothes> successClosetClothes = closetClothesRepository.findAllByClothesIds(successClothes);
			for (ClosetClothes closetClothes : successClosetClothes) {
				closetClothes.updateImgUrl(closetClothes.getClothes().getImageUrl());
			}
		}

		// 실패한 의류 처리
		if (failClothes != null && !failClothes.isEmpty()) {
			List<Clothes> failedClothes = clothesRepository.findAllByIds(failClothes);
			for (Clothes clothes : failedClothes) {
				clothesRepository.deleteById(clothes.getId());
			}
		}
	}

	@Transactional
	@Override
	public void markPhotoClothesAsAiCompleted(Long memberId, List<Long> successClosetClothes,
		List<Long> failClosetClothes) {
		if (failClosetClothes != null && !failClosetClothes.isEmpty()) {
			List<ClosetClothes> failedClosetClothes = closetClothesRepository.findAllByIds(failClosetClothes);
			for (ClosetClothes closetClothes : failedClosetClothes) {
				closetClothes.updateImgUrl(
					closetClothes.getClothes().getImageUrl()); // 실패한 의류 삭제 X, 사용자가 업로드한 이미지 그대로 복사
			}
		}
	}
}

package com.ssafy.sharedress.application.clothes.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.clothes.dto.ClothesSearchResponse;
import com.ssafy.sharedress.application.clothes.usecase.ClothesUseCase;
import com.ssafy.sharedress.domain.clothes.repository.ClothesRepository;
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
		List<Long> categoryIds,
		Long shopId,
		Long cursorId,
		int size
	) {
		return clothesRepository.searchClothesWithCursor(keyword, categoryIds, shopId, cursorId, size);
	}

	@Transactional
	@Override
	public void markClothesAsAiCompleted(Long memberId, String fcmToken) {
		log.info("AI 전처리 완료 알림 수신: memberId={}, fcmToken={}", memberId, fcmToken);

		// TODO[지윤]: FCM 전송 로직 구현 필요
		// fcmService.sendNotification(fcmToken, "AI 전처리 완료", "옷 등록이 완료되었습니다!");
		//log.info("FCM 전송 완료: memberId={}", memberId);
	}
}

package com.ssafy.sharedress.application.clothes.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.clothes.dto.ClothesSearchResponse;
import com.ssafy.sharedress.application.clothes.usecase.ClothesUseCase;
import com.ssafy.sharedress.domain.clothes.repository.ClothesRepository;
import com.ssafy.sharedress.domain.notification.port.PushNotificationPort;
import com.ssafy.sharedress.global.dto.CursorPageResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClothesService implements ClothesUseCase {

	private final ClothesRepository clothesRepository;
	private final PushNotificationPort pushNotificationPort;

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

	@Transactional
	@Override
	public void markClothesAsAiCompleted(Long memberId, String fcmToken) {
		log.info("AI 전처리 완료 알림 수신: memberId={}, fcmToken={}", memberId, fcmToken);

		// TODO[지윤]: FCM 전송 로직 구현 필요
		String title = "AI 전처리 완료";
		String body = "이미지 분석이 완료되어 옷장이 업데이트되었습니다.";

		try {
			pushNotificationPort.send(fcmToken, title, body);
			log.info("FCM 전송 완료: memberId={}", memberId);
		} catch (Exception e) {
			log.error("FCM 전송 실패: memberId={}, error={}", memberId, e.getMessage(), e);
		}
	}
}

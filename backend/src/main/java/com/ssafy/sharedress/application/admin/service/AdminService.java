package com.ssafy.sharedress.application.admin.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.admin.usecase.AdminUseCase;
import com.ssafy.sharedress.application.aop.SendNotification;
import com.ssafy.sharedress.domain.admin.entity.Admin;
import com.ssafy.sharedress.domain.admin.entity.AdminPhoto;
import com.ssafy.sharedress.domain.admin.repository.AdminPhotoRepository;
import com.ssafy.sharedress.domain.admin.repository.AdminRepository;
import com.ssafy.sharedress.domain.ai.entity.AiTask;
import com.ssafy.sharedress.domain.ai.error.TaskErrorCode;
import com.ssafy.sharedress.domain.ai.repository.AiTaskRepository;
import com.ssafy.sharedress.domain.closet.entity.Closet;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.error.ClosetErrorCode;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.domain.closet.repository.ClosetRepository;
import com.ssafy.sharedress.domain.clothes.entity.Clothes;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRepository;
import com.ssafy.sharedress.domain.friend.repository.FriendRepository;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.domain.notification.entity.NotificationType;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService implements AdminUseCase {

	private final AdminRepository adminRepository;
	private final ClosetRepository closetRepository;
	private final ClosetClothesRepository closetClothesRepository;
	private final AiTaskRepository aiTaskRepository;
	private final FriendRepository friendRepository;
	private final AdminPhotoRepository adminPhotoRepository;
	private final MemberRepository memberRepository;
	private final CoordinationRepository coordinationRepository;

	@SendNotification(NotificationType.AI_COMPLETE)
	@Override
	@Transactional
	public void runDemoPurchaseScanFlow(Long memberId) {

		List<Admin> admins = adminRepository.findAllByMemberId(memberId);
		if (admins.isEmpty()) {
			log.warn("Admin 데이터가 존재하지 않음: memberId={}", memberId);
			return;
		}

		String taskId = admins.get(0).getTaskId();

		Closet closet = closetRepository.findByMemberId(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetErrorCode.CLOSET_NOT_FOUND));

		for (Admin admin : admins) {
			Clothes clothes = admin.getClothes();

			Optional<ClosetClothes> existing = closetClothesRepository.findByClosetIdAndClothesId(
				closet.getId(), clothes.getId());

			if (existing.isPresent()) {
				existing.get().updateImgUrl(clothes.getImageUrl());
				continue;
			}

			ClosetClothes closetClothes = new ClosetClothes(closet, clothes);
			closetClothes.updateImgUrl(clothes.getImageUrl());
			closetClothesRepository.save(closetClothes);
			log.info("시연용 옷 등록 완료: clothesId={}, closetId={}", clothes.getId(), closet.getId());
		}

		AiTask aiTask = aiTaskRepository.findById(taskId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(TaskErrorCode.TASK_NOT_FOUND));
		aiTask.updateCompleted();

		adminRepository.deleteAllByTaskId(taskId);
		log.info("Admin 테이블 정리 완료: 삭제 taskId={}", taskId);
	}

	@Override
	@Transactional
	public void deleteAllClosetClothes(Long memberId) {
		Closet closet = closetRepository.findByMemberId(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetErrorCode.CLOSET_NOT_FOUND));

		coordinationRepository.findMyCoordinations(memberId)
			.forEach(coordinationRepository::delete);

		closetClothesRepository.findAllByMemberId(memberId)
			.forEach(closetClothesRepository::delete);
	}

	@Override
	@Transactional
	public void deleteAllFriends(Long memberId) {
		friendRepository.deleteAllByMemberId(memberId);
	}

	@SendNotification(NotificationType.AI_COMPLETE)
	@Override
	@Transactional
	public void runDemoPhotoFlow(Long memberId) {
		List<AdminPhoto> adminPhotos = adminPhotoRepository.findAllByMemberId(memberId);

		String taskId = adminPhotos.get(0).getTaskId();

		// TODO: 시연 때 사진 업로드 이미지 완료된 애로 변경해주기
		adminPhotos.forEach(adminPhoto -> adminPhoto
			.getClosetClothes()
			.updateImgUrl(
				"https://ai-processing-output.s3.ap-northeast-2.amazonaws.com/1_1_029fd132-b730-4c7d-bc18-1774fddbde08.png"));

		AiTask aiTask = aiTaskRepository.findById(taskId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(TaskErrorCode.TASK_NOT_FOUND));
		aiTask.updateCompleted(); // true 로 업데이트

		adminPhotoRepository.deleteAll(adminPhotos);
		log.info("AdminPhoto 테이블 정리 완료: 삭제 taskId={}", taskId);
	}

	@Override
	@Transactional
	public void updateFalsePrivacy(Long memberId) {
		memberRepository.findById(memberId)
			.ifPresent(member -> {
				member.updatePrivacyAgreement(false);
			});
	}

}

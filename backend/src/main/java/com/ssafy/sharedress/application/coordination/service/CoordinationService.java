package com.ssafy.sharedress.application.coordination.service;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequestDto;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;
import com.ssafy.sharedress.application.coordination.dto.UpdateCoordinationIsPublicRequest;
import com.ssafy.sharedress.application.coordination.dto.UpdateCoordinationThumbnailResponse;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationUseCase;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.domain.common.context.UserContext;
import com.ssafy.sharedress.domain.common.context.UserContextErrorCode;
import com.ssafy.sharedress.domain.common.port.ImageStoragePort;
import com.ssafy.sharedress.domain.coordination.entity.Coordination;
import com.ssafy.sharedress.domain.coordination.entity.CoordinationClothes;
import com.ssafy.sharedress.domain.coordination.error.CoordinationErrorCode;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRepository;
import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.guest.error.GuestErrorCode;
import com.ssafy.sharedress.domain.guest.repository.GuestRepository;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.error.MemberErrorCode;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoordinationService implements CoordinationUseCase {

	@Value("${cloud.aws.s3.path.coordination}")
	private String coordinationPath;

	private final MemberRepository memberRepository;
	private final GuestRepository guestRepository;
	private final ClosetClothesRepository closetClothesRepository;
	private final CoordinationRepository coordinationRepository;
	private final ImageStoragePort imageStoragePort;

	@Transactional
	@Override
	public CoordinationResponse saveMyCoordination(Long myId, CoordinationRequestDto coordinationRequestDto) {
		Member member = memberRepository
			.findById(myId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		Coordination coordination = Coordination.createByMember(
			coordinationRequestDto.title(),
			coordinationRequestDto.description(),
			coordinationRequestDto.isPublic(),
			coordinationRequestDto.isTemplate(),
			member,
			member,
			member
		);

		coordinationRequestDto.items().forEach(item -> {
			// TODO[준]: 상대방의 옷장에 있는 옷인지 확인하는 로직 추가
			ClosetClothes closetClothes = closetClothesRepository.getReferenceById(item.id());
			CoordinationClothes coordinationClothes = item.toEntity(coordination, closetClothes);
			coordination.addCoordinationClothes(coordinationClothes);
		});

		return CoordinationResponse.fromEntity(
			coordinationRepository.save(coordination)
		);
	}

	@Transactional
	@Override
	public CoordinationResponse recommendCoordination(UserContext userContext, Long targetMemberId,
		CoordinationRequestDto coordinationRequestDto) {

		if (userContext.isMember()) {
			return handleMemberRecommendCoordination(
				userContext.getId(),
				targetMemberId,
				coordinationRequestDto
			);
		}

		if (userContext.isGuest()) {
			return handleGuestRecommendCoordination(
				userContext.getId(),
				targetMemberId,
				coordinationRequestDto
			);
		}

		ExceptionUtil.throwException(UserContextErrorCode.USER_UNAUTHORIZED);
		return null;
	}

	@Transactional
	@Override
	public CoordinationResponse copyCoordination(Long myId, Long targetCoordinationId) {
		Coordination coordination = coordinationRepository.findByIdWithOwnerAndOriginCreator(targetCoordinationId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(CoordinationErrorCode.COORDINATION_NOT_FOUND));

		// 검증 로직
		if (!Objects.equals(coordination.getOwner().getId(), myId)) {
			ExceptionUtil.throwException(CoordinationErrorCode.COORDINATION_IS_NOT_MINE);
		}

		if (Objects.equals(coordination.getOriginCreator().getId(), myId)) {
			ExceptionUtil.throwException(CoordinationErrorCode.COORDINATION_ALREADY_MINE);
		}

		Member member = memberRepository.getReferenceById(myId);

		Coordination copyCoordination = Coordination.createByMember(
			coordination.getTitle(),
			coordination.getContent(),
			coordination.getIsPublic(),
			coordination.getIsTemplate(),
			member,
			coordination.getOwner(),
			coordination.getOriginCreator()
		);

		// deep copy 필요
		for (CoordinationClothes clothes : coordination.getCoordinationClothes()) {
			CoordinationClothes copied = new CoordinationClothes(
				clothes.getPosition(),
				clothes.getScale(),
				clothes.getRotation(),
				copyCoordination,
				clothes.getClosetClothes()
			);
			copyCoordination.addCoordinationClothes(copied);
		}

		// TODO[준]: 코디를 복사했다는 알림 전송 로직 추가

		return CoordinationResponse.fromEntity(
			coordinationRepository.save(copyCoordination)
		);
	}

	@Transactional
	@Override
	public UpdateCoordinationThumbnailResponse updateThumbnail(MultipartFile thumbnail, Long coordinationId) {
		if (thumbnail == null || thumbnail.isEmpty()) {
			ExceptionUtil.throwException(CoordinationErrorCode.INVALID_THUMBNAIL);
		}

		Coordination coordination = coordinationRepository.findById(coordinationId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(CoordinationErrorCode.COORDINATION_NOT_FOUND));

		String previousUrl = coordination.getThumbnail();
		if (previousUrl != null && !previousUrl.isBlank()) {
			String previousKey = imageStoragePort.extractKeyFromUrl(previousUrl);
			imageStoragePort.delete(previousKey);
		}

		String thumbnailUrl = imageStoragePort.upload(coordinationPath, thumbnail);
		coordination.updateThumbnail(thumbnailUrl);

		return new UpdateCoordinationThumbnailResponse(thumbnailUrl);
	}

	@Transactional
	@Override
	public void removeCoordination(Long myId, Long coordinationId) {
		// TODO[준]: memberId가 closetClothesId의 소유자와 같은지 확인하는 로직 추가
		coordinationRepository.deleteById(coordinationId);
	}

	@Transactional
	@Override
	public CoordinationResponse updateIsPublic(Long myId, Long coordinationId,
		UpdateCoordinationIsPublicRequest request) {
		// TODO[준]: memberId가 closetClothesId의 소유자와 같은지 확인하는 로직 추가

		Coordination coordination = coordinationRepository.findById(coordinationId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(CoordinationErrorCode.COORDINATION_NOT_FOUND));

		coordination.updateIsPublic(request.isPublic());
		return CoordinationResponse.fromEntity(coordination);
	}

	// -- 게스트 -- //
	private CoordinationResponse handleGuestRecommendCoordination(
		Long guestId,
		Long targetMemberId,
		CoordinationRequestDto coordinationRequestDto
	) {
		// TODO[준]: guest 가 targetMemberId의 코디를 추천할 수 있는지 확인하는 로직이 필요

		Guest creator = guestRepository
			.findById(guestId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(GuestErrorCode.GUEST_NOT_FOUND));

		Member owner = memberRepository
			.findById(targetMemberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		Coordination coordination = Coordination.createByGuest(
			coordinationRequestDto.title(),
			coordinationRequestDto.description(),
			true,
			coordinationRequestDto.isTemplate(),
			creator,
			owner,
			creator
		);

		// TODO[준]: 코디를 추천했다는 알림 전송 로직 추가

		coordinationRequestDto.items().forEach(item -> {
			// TODO[준]: 상대방의 옷장에 있는 옷인지 확인하는 로직 추가
			ClosetClothes closetClothes = closetClothesRepository.getReferenceById(item.id());
			CoordinationClothes coordinationClothes = item.toEntity(coordination, closetClothes);
			coordination.addCoordinationClothes(coordinationClothes);
		});

		return CoordinationResponse.fromEntity(
			coordinationRepository.save(coordination)
		);
	}

	// -- 멤버 -- //
	private CoordinationResponse handleMemberRecommendCoordination(
		Long memberId,
		Long targetMemberId,
		CoordinationRequestDto coordinationRequestDto
	) {
		// TODO[준]: 나와 상대방이 친구 관계인지 확인하는 로직 추가

		Member creator = memberRepository
			.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		Member owner = memberRepository
			.findById(targetMemberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		Coordination coordination = Coordination.createByMember(
			coordinationRequestDto.title(),
			coordinationRequestDto.description(),
			true,
			coordinationRequestDto.isTemplate(),
			creator,
			owner,
			creator
		);

		// TODO[준]: 코디를 추천했다는 알림 전송 로직 추가

		coordinationRequestDto.items().forEach(item -> {
			// TODO[준]: 상대방의 옷장에 있는 옷인지 확인하는 로직 추가
			ClosetClothes closetClothes = closetClothesRepository.getReferenceById(item.id());
			CoordinationClothes coordinationClothes = item.toEntity(coordination, closetClothes);
			coordination.addCoordinationClothes(coordinationClothes);
		});

		return CoordinationResponse.fromEntity(
			coordinationRepository.save(coordination)
		);
	}
}

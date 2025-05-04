package com.ssafy.sharedress.application.coordination.service;

import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequestDto;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationUseCase;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.domain.coordination.entity.Coordination;
import com.ssafy.sharedress.domain.coordination.entity.CoordinationClothes;
import com.ssafy.sharedress.domain.coordination.error.CoordinationErrorCode;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRepository;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.error.MemberErrorCode;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoordinationService implements CoordinationUseCase {

	private final MemberRepository memberRepository;
	private final ClosetClothesRepository closetClothesRepository;
	private final CoordinationRepository coordinationRepository;

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
	public CoordinationResponse recommendCoordination(Long myId, Long targetMemberId,
		CoordinationRequestDto coordinationRequestDto) {
		// TODO[준]: 나와 상대방이 친구 관계인지 확인하는 로직 추가

		Member creator = memberRepository
			.findById(myId)
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

		Coordination copyCoordination = new Coordination(
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
}

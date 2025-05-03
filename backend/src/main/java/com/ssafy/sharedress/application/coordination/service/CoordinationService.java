package com.ssafy.sharedress.application.coordination.service;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequest;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationUseCase;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.domain.coordination.entity.Coordination;
import com.ssafy.sharedress.domain.coordination.entity.CoordinationClothes;
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

	@Override
	public CoordinationResponse saveMyCoordination(Long myId, CoordinationRequest coordinationRequest) {
		Member member = memberRepository
			.findById(myId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		Coordination coordination = Coordination.createByMember(
			coordinationRequest.title(),
			coordinationRequest.description(),
			coordinationRequest.isPublic(),
			coordinationRequest.isTemplate(),
			member,
			member,
			member
		);

		coordinationRequest.items().forEach(item -> {
			ClosetClothes closetClothes = closetClothesRepository.getReferenceById(item.id());
			CoordinationClothes coordinationClothes = item.toEntity(coordination, closetClothes);
			coordination.addCoordinationClothes(coordinationClothes);
		});

		return CoordinationResponse.fromEntity(
			coordinationRepository.save(coordination)
		);
	}
}

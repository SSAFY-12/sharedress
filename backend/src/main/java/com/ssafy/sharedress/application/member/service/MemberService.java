package com.ssafy.sharedress.application.member.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.member.dto.MemberProfileResponse;
import com.ssafy.sharedress.application.member.dto.MyProfileResponse;
import com.ssafy.sharedress.application.member.usecase.MemberUseCase;
import com.ssafy.sharedress.domain.member.error.MemberErrorCode;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService implements MemberUseCase {
	private final MemberRepository memberRepository;

	@Override
	public MyProfileResponse getMyProfile(Long memberId) {
		return memberRepository.findById(memberId)
			.map(MyProfileResponse::from)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));
	}

	@Override
	public MemberProfileResponse getMemberProfile(Long memberId) {
		return memberRepository.findById(memberId)
			.map(MemberProfileResponse::from)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));
	}
}

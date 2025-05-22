package com.ssafy.sharedress.application.member.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.member.dto.CustomMemberDetails;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.error.MemberErrorCode;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomMemberDetailsService implements UserDetailsService {

	private final MemberRepository memberRepository;

	@Override
	public UserDetails loadUserByUsername(String memberId) {
		Member member = memberRepository.findById(Long.valueOf(memberId))
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));
		return new CustomMemberDetails(member);
	}
}

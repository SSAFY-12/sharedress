package com.ssafy.sharedress.application.member.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.member.dto.MemberSearchResponse;
import com.ssafy.sharedress.application.member.usecase.MemberQueryUseCase;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.global.dto.CursorPageResult;

import lombok.RequiredArgsConstructor;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class MemberQueryService implements MemberQueryUseCase {

	private final MemberRepository memberRepository;

	@Override
	public CursorPageResult<MemberSearchResponse> getMemberListByKeyword(
		Long memberId,
		String keyword,
		Long cursor,
		int size
	) {
		return memberRepository.searchMembersWithCursor(
			memberId,
			keyword,
			cursor,
			size
		);
	}
}

package com.ssafy.sharedress.application.member.service;

import org.hashids.Hashids;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.member.dto.DecodingOpenLinkResponse;
import com.ssafy.sharedress.application.member.dto.MemberSearchResponse;
import com.ssafy.sharedress.application.member.usecase.MemberQueryUseCase;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.error.MemberErrorCode;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.global.dto.CursorPageResult;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

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

	@Override
	public DecodingOpenLinkResponse decodeOpenLink(String openLink) {
		Long memberId = new Hashids("sharedress", 10).decode(openLink)[0];
		Member member = memberRepository.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		return new DecodingOpenLinkResponse(
			member.getId(),
			member.getIsPublic()
		);
	}
}

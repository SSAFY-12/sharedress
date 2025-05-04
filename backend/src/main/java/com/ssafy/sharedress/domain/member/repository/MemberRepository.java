package com.ssafy.sharedress.domain.member.repository;

import java.util.Optional;

import com.ssafy.sharedress.application.member.dto.MemberSearchResponse;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.global.dto.CursorPageResult;

public interface MemberRepository {
	Optional<Member> findById(Long id);

	Optional<Member> findByEmail(String email);

	Boolean existsByNicknameAndCode(String nickname, String code);

	Member save(Member member);

	Member getReferenceById(Long id);

	// THINK projection 으로 application 레이어에 있는 MemberSearchResponse 를 사용
	CursorPageResult<MemberSearchResponse> searchMembersWithCursor(Long myId, String keyword, Long cursorId, int size);
}

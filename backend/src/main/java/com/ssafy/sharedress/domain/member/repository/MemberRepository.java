package com.ssafy.sharedress.domain.member.repository;

import java.util.Optional;

import com.ssafy.sharedress.domain.member.entity.Member;

public interface MemberRepository {
	Optional<Member> findById(Long id);

	Optional<Member> findByEmail(String email);

	Boolean existsByNicknameAndCode(String nickname, String code);

	Member save(Member member);
}

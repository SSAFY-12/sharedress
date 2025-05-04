package com.ssafy.sharedress.adapter.member.out.persistence;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MemberPersistenceAdapter implements MemberRepository {

	private final MemberJpaRepository memberJpaRepository;

	@Override
	public Optional<Member> findById(Long id) {
		return memberJpaRepository.findById(id);
	}

	@Override
	public Optional<Member> findByEmail(String email) {
		return memberJpaRepository.findByEmail(email);
	}

	@Override
	public Boolean existsByNicknameAndCode(String nickname, String code) {
		return memberJpaRepository.existsByNicknameAndCode(nickname, code);
	}

	@Override
	public Member save(Member member) {
		return memberJpaRepository.save(member);
	}

	@Override
	public Member getReferenceById(Long id) {
		return memberJpaRepository.getReferenceById(id);
	}
}

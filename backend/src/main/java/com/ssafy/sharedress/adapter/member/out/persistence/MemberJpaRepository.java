package com.ssafy.sharedress.adapter.member.out.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sharedress.domain.member.entity.Member;

public interface MemberJpaRepository extends JpaRepository<Member, Long> {

	Optional<Member> findByEmail(String email);

	Boolean existsByNicknameAndCode(String nickname, String code);

	Optional<Member> findByFcmToken(String fcmToken);
}

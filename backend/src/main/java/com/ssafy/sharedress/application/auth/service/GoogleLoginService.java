package com.ssafy.sharedress.application.auth.service;

import java.util.Optional;
import java.util.Random;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.adapter.auth.out.GoogleUserInfoClient;
import com.ssafy.sharedress.application.auth.dto.GoogleUserInfoResponse;
import com.ssafy.sharedress.application.auth.dto.TokenWithRefresh;
import com.ssafy.sharedress.application.auth.usecase.GoogleLoginUseCase;
import com.ssafy.sharedress.application.jwt.TokenUseCase;
import com.ssafy.sharedress.domain.closet.entity.Closet;
import com.ssafy.sharedress.domain.closet.repository.ClosetRepository;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GoogleLoginService implements GoogleLoginUseCase {

	private final GoogleUserInfoClient googleUserInfoClient;
	private final MemberRepository memberRepository;
	private final TokenUseCase tokenUseCase;
	private final ClosetRepository closetRepository;

	@Transactional
	@Override
	public TokenWithRefresh login(String googleAccessToken) {
		// 1. user info 얻기
		GoogleUserInfoResponse userInfo = googleUserInfoClient.getUserInfo("Bearer " + googleAccessToken);

		// 2. 로그인/회원가입 처리
		Optional<Member> member = memberRepository.findByEmail(userInfo.email());

		if (member.isEmpty()) {
			String code = generateUniqueNicknameCode(userInfo.name());
			Member newMember = new Member(userInfo.email(), userInfo.picture(), userInfo.name(), code);
			try {
				member = Optional.ofNullable(memberRepository.save(newMember));
				closetRepository.save(new Closet(member.get()));
			} catch (ConstraintViolationException e) {
				member = memberRepository.findByEmail(userInfo.email());
			}
		}

		// 3. JWT 토큰 발급 & 저장
		return tokenUseCase.issueToken(member.get().getId());
	}

	public String generateUniqueNicknameCode(String nickname) {
		for (int i = 0; i < 10_000; i++) { // 최대 10,000회 시도
			String code = String.format("%04d", new Random().nextInt(10_000));

			boolean exists = memberRepository.existsByNicknameAndCode(nickname, code);
			if (!exists) {
				return code;
			}
		}
		throw new RuntimeException("중복되지 않는 코드 생성 실패");
	}
}

package com.ssafy.sharedress.application.guest.service;

import java.util.Random;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.guest.usecase.GuestUseCase;
import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.guest.repository.GuestRepository;
import com.ssafy.sharedress.global.util.NicknameGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GuestService implements GuestUseCase {

	private final GuestRepository guestRepository;

	@Transactional
	@Override
	public String createGuest() {
		String uuid = generateGuestToken();
		String nickname = generateRandomNickname();
		String code = generateUniqueNicknameCode(nickname);

		Guest guest = new Guest(
			uuid,
			nickname,
			code
		);

		guestRepository.save(guest);
		return uuid;
	}

	private String generateGuestToken() {
		return UUID.randomUUID().toString();
	}

	private String generateRandomNickname() {
		return NicknameGenerator.generate();
	}

	private String generateUniqueNicknameCode(String nickname) {
		for (int i = 0; i < 10_000; i++) {
			String code = String.format("%04d", new Random().nextInt(10_000));

			boolean exists = guestRepository.existsByNicknameAndCode(nickname, code);
			if (!exists) {
				return code;
			}
		}
		throw new RuntimeException("중복되지 않는 코드 생성 실패");
	}
}

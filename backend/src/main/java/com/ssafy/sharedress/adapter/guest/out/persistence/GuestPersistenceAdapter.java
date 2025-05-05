package com.ssafy.sharedress.adapter.guest.out.persistence;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.guest.repository.GuestRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class GuestPersistenceAdapter implements GuestRepository {

	private final GuestJpaRepository guestJpaRepository;

	@Override
	public void save(Guest guest) {
		guestJpaRepository.save(guest);
	}

	@Override
	public boolean existsByNicknameAndCode(String nickname, String code) {
		return guestJpaRepository.existsByNicknameAndCode(nickname, code);
	}

	@Override
	public Optional<Guest> findById(Long id) {
		return guestJpaRepository.findById(id);
	}

	@Override
	public Optional<Guest> findByUuid(String token) {
		return guestJpaRepository.findByUuid(token);
	}
}

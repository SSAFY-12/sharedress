package com.ssafy.sharedress.domain.guest.repository;

import java.util.Optional;

import com.ssafy.sharedress.domain.guest.entity.Guest;

public interface GuestRepository {
	void save(Guest guest);

	boolean existsByNicknameAndCode(String nickname, String code);

	Optional<Guest> findById(Long id);
}

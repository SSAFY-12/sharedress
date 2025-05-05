package com.ssafy.sharedress.adapter.guest.out.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sharedress.domain.guest.entity.Guest;

public interface GuestJpaRepository extends JpaRepository<Guest, Long> {
	boolean existsByNicknameAndCode(String nickname, String code);

	Optional<Guest> findByUuid(String uuid);
}

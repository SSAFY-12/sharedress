package com.ssafy.sharedress.domain.closet.repository;

import java.util.Optional;

import com.ssafy.sharedress.domain.closet.entity.Closet;

public interface ClosetRepository {
	Optional<Closet> findByMemberId(Long memberId);
}

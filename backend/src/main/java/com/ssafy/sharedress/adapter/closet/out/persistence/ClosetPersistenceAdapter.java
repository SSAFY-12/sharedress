package com.ssafy.sharedress.adapter.closet.out.persistence;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.domain.closet.entity.Closet;
import com.ssafy.sharedress.domain.closet.repository.ClosetRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClosetPersistenceAdapter implements ClosetRepository {

	private final ClosetJpaRepository closetJpaRepository;

	@Override
	public Optional<Closet> findByMemberId(Long memberId) {
		return closetJpaRepository.findByMemberId(memberId);
	}
}

package com.ssafy.sharedress.adapter.closet.out.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.sharedress.domain.closet.entity.Closet;

public interface ClosetJpaRepository extends JpaRepository<Closet, Long> {

	@Query("""
		SELECT c FROM Closet c WHERE c.member.id = :memberId
		""")
	Optional<Closet> findByMemberId(Long memberId);
}

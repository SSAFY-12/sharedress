package com.ssafy.sharedress.adapter.closet.out.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;

public interface ClosetClothesJpaRepository extends JpaRepository<ClosetClothes, Long> {
	Boolean existsByClosetIdAndClothesId(Long closetId, Long clothesId);

	@Query("""
			SELECT cc.clothes.id
			FROM ClosetClothes cc
			WHERE cc.closet.id = :closetId AND cc.clothes.id IN :clothesIds
		""")
	List<Long> findClothesIdsByClosetIdAndClothesIdIn(
		@Param("closetId") Long closetId,
		@Param("clothesIds") List<Long> clothesIds);

	@Query("""
			SELECT CASE WHEN COUNT(cc) > 0 THEN true ELSE false END
			FROM ClosetClothes cc
			JOIN cc.closet cls
			WHERE cc.id = :closetClothesId AND cls.member.id = :memberId
		""")
	Boolean existsByIdAndMemberId(@Param("closetClothesId") Long closetClothesId, @Param("memberId") Long memberId);
}

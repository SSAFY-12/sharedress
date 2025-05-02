package com.ssafy.sharedress.adapter.clothes.out.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.sharedress.domain.clothes.entity.Clothes;

public interface ClothesJpaRepository extends JpaRepository<Clothes, Long> {
	@Query("""
			SELECT c
			FROM Clothes c
			WHERE c.name = :name
			AND c.brand.id = :brandId
		""")
	Optional<Clothes> findByNameAndBrandId(@Param("name") String name, @Param("brandId") Long brandId);
}

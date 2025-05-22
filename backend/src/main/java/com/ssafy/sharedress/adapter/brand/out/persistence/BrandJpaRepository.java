package com.ssafy.sharedress.adapter.brand.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.sharedress.domain.brand.entity.Brand;

public interface BrandJpaRepository extends JpaRepository<Brand, Long> {
	@Query("""
		SELECT b
		FROM Brand b
		WHERE b.nameKr LIKE CONCAT('%', :keyword, '%')
		OR LOWER(b.nameEn) LIKE CONCAT('%', LOWER(:keyword), '%')
		""")
	List<Brand> searchByKeyword(@Param("keyword") String keyword);

	@Query("""
		SELECT b FROM Brand b
		WHERE b.nameKr = :nameKr
		OR LOWER(b.nameEn) = LOWER(:nameEn)
		""")
	Optional<Brand> findByExactNameEnOrKr(@Param("nameEn") String nameEn, @Param("nameKr") String nameKr);
}

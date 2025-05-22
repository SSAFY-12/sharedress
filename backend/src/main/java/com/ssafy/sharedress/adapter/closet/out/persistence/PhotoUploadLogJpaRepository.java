package com.ssafy.sharedress.adapter.closet.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.sharedress.domain.clothes.entity.PhotoUploadLog;

public interface PhotoUploadLogJpaRepository extends JpaRepository<PhotoUploadLog, Long> {

	@Query(value = """
			SELECT COUNT(*)
			FROM photo_upload_log
			WHERE member_id = :memberId
			AND created_at BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 DAY)
		""", nativeQuery = true)
	Integer countByMemberIdAndCreatedAt(@Param("memberId") Long memberId);
}

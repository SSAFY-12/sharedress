package com.ssafy.sharedress.adapter.admin.out.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.sharedress.domain.admin.entity.AdminPhoto;

public interface AdminPhotoJpaRepository extends JpaRepository<AdminPhoto, Long> {
	@Query("SELECT ap FROM AdminPhoto ap WHERE ap.member.id = :memberId")
	List<AdminPhoto> findAllByMemberId(@Param("memberId") Long memberId);
}

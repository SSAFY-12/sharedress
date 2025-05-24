package com.ssafy.sharedress.adapter.admin.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.sharedress.domain.admin.entity.Admin;

public interface AdminJpaRepository extends JpaRepository<Admin, Long> {

	@Query("SELECT ad FROM Admin ad WHERE ad.member.id = :memberId")
	Optional<Admin> findByMemberId(@Param("memberId") Long memberId);

	List<Admin> findAllByMember_Id(Long memberId);

	List<Admin> findAllByTaskId(String taskId);

	void deleteAllByTaskId(String taskId);
}

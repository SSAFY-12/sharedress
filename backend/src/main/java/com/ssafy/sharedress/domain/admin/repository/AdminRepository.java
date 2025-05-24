package com.ssafy.sharedress.domain.admin.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.sharedress.domain.admin.entity.Admin;

public interface AdminRepository {
	Admin save(Admin admin);

	Optional<Admin> findByMemberId(Long memberId);

	List<Admin> findAllByMemberId(Long memberId);

	List<Admin> findAllByTaskId(String taskId);

	void deleteAllByTaskId(String taskId);
}

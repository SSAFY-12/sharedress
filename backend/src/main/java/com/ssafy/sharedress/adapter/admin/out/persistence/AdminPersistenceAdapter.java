package com.ssafy.sharedress.adapter.admin.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.admin.entity.Admin;
import com.ssafy.sharedress.domain.admin.repository.AdminRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AdminPersistenceAdapter implements AdminRepository {

	private final AdminJpaRepository adminJpaRepository;

	@Override
	public Admin save(Admin admin) {
		return adminJpaRepository.save(admin);
	}

	@Override
	public Optional<Admin> findByMemberId(Long memberId) {
		return adminJpaRepository.findByMemberId(memberId);
	}

	@Override
	public List<Admin> findAllByMemberId(Long memberId) {
		return adminJpaRepository.findAllByMember_Id(memberId);
	}

	@Override
	public List<Admin> findAllByTaskId(String taskId) {
		return adminJpaRepository.findAllByTaskId(taskId);
	}

	@Override
	public void deleteAllByTaskId(String taskId) {
		adminJpaRepository.deleteAllByTaskId(taskId);
	}
}

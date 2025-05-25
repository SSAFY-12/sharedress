package com.ssafy.sharedress.adapter.admin.out.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.admin.entity.AdminPhoto;
import com.ssafy.sharedress.domain.admin.repository.AdminPhotoRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AdminPhotoPersistenceAdapter implements AdminPhotoRepository {

	private final AdminPhotoJpaRepository adminPhotoJpaRepository;

	@Override
	public AdminPhoto save(AdminPhoto adminPhoto) {
		return adminPhotoJpaRepository.save(adminPhoto);
	}

	@Override
	public List<AdminPhoto> findAllByMemberId(Long memberId) {
		return adminPhotoJpaRepository.findAllByMemberId(memberId);
	}

	@Override
	public void deleteAll(List<AdminPhoto> adminPhotos) {
		adminPhotoJpaRepository.deleteAll(adminPhotos);
	}
}

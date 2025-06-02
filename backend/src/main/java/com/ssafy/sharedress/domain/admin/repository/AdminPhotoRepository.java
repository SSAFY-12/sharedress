package com.ssafy.sharedress.domain.admin.repository;

import java.util.List;

import com.ssafy.sharedress.domain.admin.entity.AdminPhoto;

public interface AdminPhotoRepository {
	AdminPhoto save(AdminPhoto adminPhoto);

	List<AdminPhoto> findAllByMemberId(Long memberId);

	void deleteAll(List<AdminPhoto> adminPhotos);
}

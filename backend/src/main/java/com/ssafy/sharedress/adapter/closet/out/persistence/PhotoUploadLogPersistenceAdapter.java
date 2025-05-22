package com.ssafy.sharedress.adapter.closet.out.persistence;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.clothes.entity.PhotoUploadLog;
import com.ssafy.sharedress.domain.clothes.repository.PhotoUploadLogRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PhotoUploadLogPersistenceAdapter implements PhotoUploadLogRepository {

	private final PhotoUploadLogJpaRepository photoUploadLogJpaRepository;

	@Override
	public PhotoUploadLog save(PhotoUploadLog photoUploadLog) {
		return photoUploadLogJpaRepository.save(photoUploadLog);
	}

	@Override
	public Integer countByMemberIdAndCreatedAt(Long memberId) {
		return photoUploadLogJpaRepository.countByMemberIdAndCreatedAt(memberId);
	}
}

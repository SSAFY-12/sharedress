package com.ssafy.sharedress.domain.clothes.repository;

import com.ssafy.sharedress.domain.clothes.entity.PhotoUploadLog;

public interface PhotoUploadLogRepository {

	PhotoUploadLog save(PhotoUploadLog photoUploadLog);

	Integer countByMemberIdAndCreatedAt(Long memberId);
}

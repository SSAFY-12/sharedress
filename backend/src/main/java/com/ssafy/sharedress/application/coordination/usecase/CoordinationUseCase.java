package com.ssafy.sharedress.application.coordination.usecase;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequestDto;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;
import com.ssafy.sharedress.application.coordination.dto.UpdateCoordinationThumbnailResponse;

public interface CoordinationUseCase {
	CoordinationResponse saveMyCoordination(Long myId, CoordinationRequestDto coordinationRequestDto);

	CoordinationResponse recommendCoordination(Long myId, Long targetMemberId,
		CoordinationRequestDto coordinationRequestDto);

	CoordinationResponse copyCoordination(Long myId, Long targetCoordinationId);

	UpdateCoordinationThumbnailResponse updateThumbnail(MultipartFile thumbnail, Long coordinationId);
}

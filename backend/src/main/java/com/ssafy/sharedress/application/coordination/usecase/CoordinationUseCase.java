package com.ssafy.sharedress.application.coordination.usecase;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequestDto;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;
import com.ssafy.sharedress.application.coordination.dto.UpdateCoordinationIsPublicRequest;
import com.ssafy.sharedress.application.coordination.dto.UpdateCoordinationThumbnailResponse;
import com.ssafy.sharedress.domain.common.context.UserContext;

public interface CoordinationUseCase {
	CoordinationResponse saveMyCoordination(Long myId, CoordinationRequestDto coordinationRequestDto);

	CoordinationResponse recommendCoordination(UserContext userContext, Long targetMemberId,
		CoordinationRequestDto coordinationRequestDto);

	CoordinationResponse copyCoordination(Long myId, Long targetCoordinationId);

	UpdateCoordinationThumbnailResponse updateThumbnail(Long myId, MultipartFile thumbnail, Long coordinationId);

	void removeCoordination(Long myId, Long coordinationId);

	CoordinationResponse updateIsPublic(Long myId, Long coordinationId, UpdateCoordinationIsPublicRequest request);
}

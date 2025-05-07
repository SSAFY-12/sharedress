package com.ssafy.sharedress.application.coordination.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.sharedress.application.member.dto.MemberProfileResponse;
import com.ssafy.sharedress.domain.coordination.entity.Coordination;

public record CoordinationDetailResponse(
	Long id,
	String title,
	String description,
	Boolean isPublic,
	Boolean isTemplate,
	String thumbnail,
	List<CoordinationClothesResponse> items,
	MemberProfileResponse creator,
	MemberProfileResponse owner,
	LocalDateTime createdAt
) {

	public static CoordinationDetailResponse fromEntity(Coordination coordination) {
		return new CoordinationDetailResponse(
			coordination.getId(),
			coordination.getTitle(),
			coordination.getContent(),
			coordination.getIsPublic(),
			coordination.getIsTemplate(),
			coordination.getThumbnail(),
			coordination.getCoordinationClothes().stream()
				.map(CoordinationClothesResponse::fromEntity)
				.toList(),
			MemberProfileResponse.from(coordination.getOriginCreator()),
			MemberProfileResponse.from(coordination.getOwner()),
			coordination.getCreatedAt()
		);
	}
}

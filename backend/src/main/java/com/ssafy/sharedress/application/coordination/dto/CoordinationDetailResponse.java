package com.ssafy.sharedress.application.coordination.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.sharedress.application.member.dto.MemberProfileResponse;
import com.ssafy.sharedress.domain.coordination.entity.Coordination;
import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.member.entity.Member;

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
		Member originCreator = coordination.getOriginCreator();
		Guest originCreatorGuest = coordination.getOriginCreatorGuest();
		MemberProfileResponse originCreatorProfile = originCreator != null
			? MemberProfileResponse.from(originCreator)
			: MemberProfileResponse.from(originCreatorGuest);

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
			originCreatorProfile,
			MemberProfileResponse.from(coordination.getOwner()),
			coordination.getCreatedAt()
		);
	}
}

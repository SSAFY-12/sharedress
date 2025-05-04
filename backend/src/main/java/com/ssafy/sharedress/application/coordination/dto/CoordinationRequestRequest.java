package com.ssafy.sharedress.application.coordination.dto;

import com.ssafy.sharedress.domain.coordination.entity.CoordinationRequest;
import com.ssafy.sharedress.domain.member.entity.Member;

public record CoordinationRequestRequest(
	Long receiverId,
	String message
) {

	public CoordinationRequest toEntity(Member requester, Member receiver) {
		return new CoordinationRequest(
			requester,
			receiver,
			message
		);
	}
}

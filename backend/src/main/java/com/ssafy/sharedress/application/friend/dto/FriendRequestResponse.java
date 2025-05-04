package com.ssafy.sharedress.application.friend.dto;

import com.ssafy.sharedress.domain.friend.entity.FriendRequest;

public record FriendRequestResponse(
	Long id,
	String message,
	RequestMember requester
) {
	public static FriendRequestResponse fromEntity(FriendRequest friendRequest) {
		return new FriendRequestResponse(
			friendRequest.getId(),
			friendRequest.getMessage(),
			new RequestMember(
				friendRequest.getRequester().getId(),
				friendRequest.getRequester().getProfileUrl(),
				friendRequest.getRequester().getNickname()
			)
		);
	}

	public record RequestMember(
		Long id,
		String profileImage,
		String nickname
	) {
	}
}

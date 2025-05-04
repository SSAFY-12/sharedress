package com.ssafy.sharedress.application.friend.dto;

import com.ssafy.sharedress.domain.friend.entity.FriendRequest;
import com.ssafy.sharedress.domain.member.entity.Member;

public record FriendRequestDto(
	Long receiverId,
	String message
) {
	public FriendRequest toEntity(Member requester, Member receiver) {
		return new FriendRequest(
			message,
			requester,
			receiver
		);
	}
}

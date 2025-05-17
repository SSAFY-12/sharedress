package com.ssafy.sharedress.application.friend.dto;

import com.ssafy.sharedress.domain.friend.entity.FriendRequest;
import com.ssafy.sharedress.domain.member.entity.Member;

import jakarta.validation.constraints.Size;

public record FriendRequestDto(
	Long receiverId,
	@Size(message = "메시지는 30자 이하여야 합니다.", max = 30)
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

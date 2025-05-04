package com.ssafy.sharedress.application.friend.dto;

import java.util.Objects;

import com.ssafy.sharedress.domain.friend.entity.Friend;
import com.ssafy.sharedress.domain.member.entity.Member;

public record FriendResponse(
	Long id,
	String nickname,
	String profileImage,
	String oneLiner
) {
	public static FriendResponse fromEntity(Friend friend, Long memberId) {
		Member friendMember = Objects.equals(friend.getMemberA().getId(), memberId)
			? friend.getMemberB()
			: friend.getMemberA();

		return new FriendResponse(
			friendMember.getId(),
			friendMember.getNickname(),
			friendMember.getProfileUrl(),
			friendMember.getStatusMessage()
		);
	}
}

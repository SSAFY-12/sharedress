package com.ssafy.sharedress.application.member.dto;

import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.member.entity.Member;

public record UserProfileResponse(
	Long id,
	boolean isGuest
) {

	public static UserProfileResponse from(Member member) {
		return new UserProfileResponse(member.getId(), false);
	}

	public static UserProfileResponse from(Guest guest) {
		return new UserProfileResponse(guest.getId(), true);
	}
}

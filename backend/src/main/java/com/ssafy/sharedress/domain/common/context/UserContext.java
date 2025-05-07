package com.ssafy.sharedress.domain.common.context;

import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

public class UserContext {
	private final Member member;
	private final Guest guest;

	public UserContext(Member member, Guest guest) {
		this.member = member;
		this.guest = guest;
	}

	public boolean isMember() {
		return member != null;
	}

	public boolean isGuest() {
		return guest != null;
	}

	public Long getId() {
		if (isMember()) {
			return member.getId();
		} else if (isGuest()) {
			return guest.getId();
		}
		ExceptionUtil.throwException(UserContextErrorCode.USER_UNAUTHORIZED);
		return null;
	}
}

package com.ssafy.sharedress.application.friend.usecase;

import java.util.List;

import com.ssafy.sharedress.application.friend.dto.FriendResponse;

public interface FriendQueryUseCase {
	List<FriendResponse> getFriendList(Long memberId);
}

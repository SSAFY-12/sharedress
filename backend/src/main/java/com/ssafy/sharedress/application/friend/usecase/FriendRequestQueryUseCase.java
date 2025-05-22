package com.ssafy.sharedress.application.friend.usecase;

import java.util.List;

import com.ssafy.sharedress.application.friend.dto.FriendRequestResponse;

public interface FriendRequestQueryUseCase {
	List<FriendRequestResponse> getFriendRequestList(Long memberId);

	FriendRequestResponse getFriendRequest(Long memberId, Long friendId);
}

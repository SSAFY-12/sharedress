package com.ssafy.sharedress.application.friend.usecase;

import com.ssafy.sharedress.application.friend.dto.FriendRequestDto;

public interface FriendRequestUseCase {
	void sendFriendRequest(Long memberId, FriendRequestDto friendRequest);

	void acceptFriendRequest(Long memberId, Long friendRequestId);

	void rejectFriendRequest(Long memberId, Long friendRequestId);

	void cancelFriendRequest(Long memberId, Long friendRequestId);
}

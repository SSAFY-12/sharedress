package com.ssafy.sharedress.application.friend.usecase;

import java.util.List;

import com.ssafy.sharedress.application.friend.dto.FriendResponse;
import com.ssafy.sharedress.application.friend.dto.FriendsWithHasRequestResponse;

public interface FriendQueryUseCase {
	List<FriendResponse> getFriendList(Long memberId);

	List<FriendResponse> getFriendListByKeyword(Long memberId, String keyword);

	FriendsWithHasRequestResponse getFriendsWithHasRequest(Long memberId);
}

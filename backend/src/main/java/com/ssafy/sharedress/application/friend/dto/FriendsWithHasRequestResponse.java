package com.ssafy.sharedress.application.friend.dto;

import java.util.List;

public record FriendsWithHasRequestResponse(
	List<FriendResponse> items,
	Boolean hasRequest
) {
}

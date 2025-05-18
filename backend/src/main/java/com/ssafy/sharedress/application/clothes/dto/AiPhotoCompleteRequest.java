package com.ssafy.sharedress.application.clothes.dto;

import java.util.List;

public record AiPhotoCompleteRequest(
	Long memberId,
	String taskId,
	List<Long> successClosetClothes,
	List<Long> failClosetClothes
) {
}

package com.ssafy.sharedress.application.clothes.dto;

import java.util.List;

public record AddLibraryClothesToClosetRequest(
	List<Long> itemsId
) {
}

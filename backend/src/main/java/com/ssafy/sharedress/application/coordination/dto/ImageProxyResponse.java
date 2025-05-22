package com.ssafy.sharedress.application.coordination.dto;

public record ImageProxyResponse(
	String base64,
	String mimeType
) {
}

package com.ssafy.sharedress.domain.common.port;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStoragePort {
	String upload(String path, MultipartFile file);

	void delete(String key);

	String extractKeyFromUrl(String url);
}

package com.ssafy.sharedress.domain.common.port;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStoragePort {
	String upload(String path, MultipartFile file);

	List<String> upload(String path, List<MultipartFile> files);

	void delete(String key);

	String extractKeyFromUrl(String url);
}

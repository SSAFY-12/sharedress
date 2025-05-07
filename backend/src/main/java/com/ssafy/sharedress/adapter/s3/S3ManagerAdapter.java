package com.ssafy.sharedress.adapter.s3;

import java.io.IOException;
import java.net.URI;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sharedress.domain.common.port.ImageStoragePort;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Slf4j
@Component
@RequiredArgsConstructor
public class S3ManagerAdapter implements ImageStoragePort {

	private final S3Client s3Client;

	@Value("${cloud.aws.region}")
	private String region;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	@Override
	public String upload(String dirName, MultipartFile file) {
		try {
			String originalFileName = file.getOriginalFilename();
			String fileName = generateFileName(originalFileName);
			String keyName = dirName + "/" + fileName;

			PutObjectRequest putObjectRequest = PutObjectRequest.builder()
				.bucket(bucket)
				.key(keyName)
				.contentType(file.getContentType())
				.build();

			s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

			return s3Client.utilities()
				.getUrl(b -> b.bucket(bucket).key(keyName))
				.toExternalForm();

		} catch (IOException e) {
			log.error("S3 업로드 실패", e);
			throw new RuntimeException("S3 업로드 실패", e);
		}
	}

	@Override
	public void delete(String key) {
		s3Client.deleteObject(b -> b.bucket(bucket).key(key));
		log.info("S3에서 삭제된 키: {}", key);
	}

	@Override
	public String extractKeyFromUrl(String url) {
		URI uri = URI.create(url);
		String path = uri.getPath(); // /profile/abc.jpg
		return path.substring(1); // profile/abc.jpg
	}

	private String generateFileName(String originalFilename) {
		String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
		return UUID.randomUUID() + ext;
	}
}

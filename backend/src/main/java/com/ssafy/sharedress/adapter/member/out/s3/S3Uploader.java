package com.ssafy.sharedress.adapter.member.out.s3;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Slf4j
@Component
@RequiredArgsConstructor
public class S3Uploader {

	private final S3Client s3Client;

	@Value("${cloud.aws.region}")
	private String region;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	public String upload(MultipartFile file, String dirName) {
		try {
			String originalFileName = file.getOriginalFilename();
			String fileName = UUID.randomUUID() + "_" + originalFileName;
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
}

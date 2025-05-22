package com.ssafy.sharedress.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.awspring.cloud.sqs.operations.SqsTemplate;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsAsyncClient;

@Configuration
public class SqsConfig {

	@Value("${cloud.aws.credentials.access-key}")
	private String accessKey;

	@Value("${cloud.aws.credentials.secret-key}")
	private String secretKey;

	@Value("${cloud.aws.region}")
	private String region;

	// 클라이언트 설정: region과 자격증명
	@Bean
	public SqsAsyncClient sqsAsyncClient() {
		return SqsAsyncClient.builder()
			.credentialsProvider(() -> new AwsCredentials() {
				@Override
				public String accessKeyId() {
					return accessKey;
				}

				@Override
				public String secretAccessKey() {
					return secretKey;
				}
			})
			.region(Region.of(region))
			.build();
	}

	// 메시지 발송을 위한 SQS 템플릿 설정 (Sender)
	@Bean
	public SqsTemplate sqsTemplate() {
		return SqsTemplate.newTemplate(sqsAsyncClient());
	}

}

package com.ssafy.sharedress.adapter.clothes.out.messaging;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.sharedress.application.clothes.dto.AiProcessMessagePhotoRequest;
import com.ssafy.sharedress.application.clothes.dto.AiProcessMessagePurchaseRequest;

import io.awspring.cloud.sqs.operations.SendResult;
import io.awspring.cloud.sqs.operations.SqsTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class SqsMessageSender {

	private final SqsTemplate sqsTemplate;
	private final ObjectMapper objectMapper;

	@Value("${cloud.aws.sqs.url}")
	private String queueUrl;

	public void send(AiProcessMessagePurchaseRequest message) {
		try {
			String json = objectMapper.writeValueAsString(message);

			String deduplicationId = UUID.randomUUID().toString();

			SendResult<String> sendResult = sqsTemplate.send(to -> to
				.queue(queueUrl)
				.payload(json)
				.header("MessageGroupId", "default") // FIFO 큐의 메시지 그룹 ID
				.header("MessageDeduplicationId", deduplicationId)
			);

			log.info("FIFO SQS 메시지 전송 완료. messageId={}", sendResult.messageId());
		} catch (JsonProcessingException e) {
			log.error("메시지 직렬화 실패", e);
			throw new RuntimeException("메시지 변환 중 오류가 발생했습니다", e);
		} catch (Exception e) {
			log.error("SQS 전송 실패", e);
			throw new RuntimeException("SQS 메시지 전송 중 오류가 발생했습니다", e);
		}
	}

	public void send(AiProcessMessagePhotoRequest message) {
		try {
			String json = objectMapper.writeValueAsString(message);

			String deduplicationId = UUID.randomUUID().toString();

			SendResult<String> sendResult = sqsTemplate.send(to -> to
				.queue(queueUrl) // TODO[지윤]: photo 처리용 큐로 url 변경
				.payload(json)
				.header("MessageGroupId", "default") // FIFO 큐의 메시지 그룹 ID
				.header("MessageDeduplicationId", deduplicationId)
			);

			log.info("FIFO SQS 메시지 전송 완료. messageId={}", sendResult.messageId());
		} catch (JsonProcessingException e) {
			log.error("메시지 직렬화 실패", e);
			throw new RuntimeException("메시지 변환 중 오류가 발생했습니다", e);
		} catch (Exception e) {
			log.error("SQS 전송 실패", e);
			throw new RuntimeException("SQS 메시지 전송 중 오류가 발생했습니다", e);
		}
	}
}

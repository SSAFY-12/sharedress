package com.ssafy.sharedress.adapter.clothes.out.messaging;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.sharedress.application.clothes.dto.AiProcessMessageRequest;

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

	@Value("${cloud.aws.sqs.queue-name}")
	private String queueName;

	public void send(AiProcessMessageRequest message) {
		try {
			String json = objectMapper.writeValueAsString(message);
			SendResult sendResult = sqsTemplate.send(to -> to.queue(queueName).payload(json));
			log.info("SQS 메시지 전송 완료. messageId={}", sendResult.messageId());
		} catch (JsonProcessingException e) {
			log.error("메시지 직렬화 실패", e);
		} catch (Exception e) {
			log.error("SQS 전송 실패", e);
		}
	}

}

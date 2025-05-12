package com.ssafy.sharedress.config;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import feign.Response;
import feign.codec.ErrorDecoder;

public class MusinsaFeignConfig {
	@Bean
	public ErrorDecoder errorDecoder() {
		return new ErrorDecoder() {
			@Override
			public Exception decode(String methodKey, Response response) {
				HttpStatus status = HttpStatus.resolve(response.status());

				if (status == HttpStatus.UNAUTHORIZED) {
					return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Musinsa 로그인 인증 실패");
				} else if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
					return new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Musinsa 서버 오류 발생");
				} else {
					return new ResponseStatusException(status != null ? status : HttpStatus.INTERNAL_SERVER_ERROR,
						"알 수 없는 오류 발생");
				}
			}
		};
	}
}

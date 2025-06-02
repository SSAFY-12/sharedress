package com.ssafy.sharedress.config;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import feign.RequestInterceptor;
import feign.Response;
import feign.codec.ErrorDecoder;

public class CM29FeignConfig {

	@Bean
	public ErrorDecoder errorDecoder() {
		return new ErrorDecoder() {
			@Override
			public Exception decode(String methodKey, Response response) {
				HttpStatus status = HttpStatus.resolve(response.status());

				if (status == HttpStatus.BAD_REQUEST) {
					return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "29CM 로그인 인증 실패");
				} else if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
					return new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "29CM 서버 오류 발생");
				} else if (status == HttpStatus.FORBIDDEN) {
					return new ResponseStatusException(HttpStatus.FORBIDDEN, "너무 잦은 29CM 요청으로 차단됨");
				} else {
					return new ResponseStatusException(status != null ? status : HttpStatus.INTERNAL_SERVER_ERROR,
						"알 수 없는 오류 발생");
				}
			}
		};
	}

	@Bean
	public RequestInterceptor requestInterceptor() {
		return requestTemplate -> {
			requestTemplate.header("Content-Type", "application/json");
			requestTemplate.header("Accept", "application/json");
		};
	}
}

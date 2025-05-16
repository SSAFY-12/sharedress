package com.ssafy.sharedress.config;

import org.springframework.context.annotation.Bean;

import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;

public class CM29FeignConfig {

	@Bean
	public ErrorDecoder errorDecoder() {
		return new ErrorDecoder.Default();
	}

	@Bean
	public RequestInterceptor requestInterceptor() {
		return requestTemplate -> {
			requestTemplate.header("Content-Type", "application/json");
			requestTemplate.header("Accept", "application/json");
		};
	}
}

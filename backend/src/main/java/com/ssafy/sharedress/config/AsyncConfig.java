package com.ssafy.sharedress.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

	@Bean(name = "fcmExecutor")
	public Executor fcmExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(4);         // 기본 스레드 수
		executor.setMaxPoolSize(10);         // 최대 스레드 수
		executor.setQueueCapacity(100);      // 대기 큐 용량
		executor.setThreadNamePrefix("fcm-async-");
		executor.initialize();
		return executor;
	}

	// 기본 AsyncExecutor 설정 (선택)
	@Override
	public Executor getAsyncExecutor() {
		return fcmExecutor();
	}
}

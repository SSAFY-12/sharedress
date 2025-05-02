package com.ssafy.sharedress.config;

import java.security.Principal;
import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@EnableJpaAuditing
public class JpaConfig {
	// TODO: 현재 테스트 코드, 추후 주석처리된 내용으로 변경해야함.
	@Bean
	public AuditorAware<String> auditorAware() {
		return () -> Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
			.map(Principal::getName)
			.orElse("test@email.com")
			.describeConstable();
	}
}

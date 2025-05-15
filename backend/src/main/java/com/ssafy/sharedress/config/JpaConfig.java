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
	@Bean
	public AuditorAware<Long> auditorAware() {
		return () -> Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
			.map(Principal::getName)
			.map(Long::valueOf)
			.orElse(-1L)
			.describeConstable();
	}
}

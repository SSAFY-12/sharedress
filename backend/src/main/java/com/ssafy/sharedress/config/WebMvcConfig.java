package com.ssafy.sharedress.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.ssafy.sharedress.application.guest.resolver.CurrentGuestArgumentResolver;
import com.ssafy.sharedress.application.member.resolver.CurrentMemberArgumentResolver;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

	private final CurrentMemberArgumentResolver memberResolver;
	private final CurrentGuestArgumentResolver guestResolver;

	@Override
	public void configurePathMatch(PathMatchConfigurer configurer) {
		configurer.addPathPrefix("/api", c -> true);
	}

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		resolvers.add(memberResolver);
		resolvers.add(guestResolver);
	}
}


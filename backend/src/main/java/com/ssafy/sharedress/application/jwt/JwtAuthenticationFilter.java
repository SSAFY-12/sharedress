package com.ssafy.sharedress.application.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ssafy.sharedress.application.member.service.CustomMemberDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider tokenProvider;
	private final JwtTokenResolver tokenResolver;
	private final CustomMemberDetailsService memberDetailsService;

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {
		String accessToken = tokenResolver.resolveAccessToken(request);

		if (accessToken != null && tokenProvider.validateToken(accessToken)) {
			String memberId = tokenProvider.getMemberId(accessToken);

			// DB에서 사용자 정보 로드
			UserDetails userDetails = memberDetailsService.loadUserByUsername(memberId);

			// 인증 정보 생성 및 SecurityContext 설정
			UsernamePasswordAuthenticationToken authentication =
				new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

			SecurityContextHolder.getContext().setAuthentication(authentication);
		}

		filterChain.doFilter(request, response); // 다음 필터로 넘김
	}
}

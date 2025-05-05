package com.ssafy.sharedress.application.guest.filter;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ssafy.sharedress.application.guest.service.CustomGuestDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class GuestAuthenticationFilter extends OncePerRequestFilter {

	private final CustomGuestDetailsService guestDetailsService;

	private static final List<String> GUEST_PATH_PREFIXES = List.of(
		"/api/coordination",
		"/api/recommend",
		"/api/comment",
		"/api/open-link"
	);

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String path = request.getRequestURI();
		return GUEST_PATH_PREFIXES.stream().noneMatch(path::startsWith);
	}

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {

		// 이미 인증된 경우 (JWT 통해 회원 인증된 경우), 필터 패스
		if (SecurityContextHolder.getContext().getAuthentication() != null) {
			filterChain.doFilter(request, response);
			return;
		}

		// 쿠키에서 guestToken 찾기
		String guestToken = extractGuestTokenFromCookies(request.getCookies());
		if (guestToken == null) {
			filterChain.doFilter(request, response);
			return;
		}

		UserDetails userDetails = guestDetailsService.loadUserByUsername(guestToken);

		if (userDetails != null) {
			UsernamePasswordAuthenticationToken authentication =
				new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

			SecurityContextHolder.getContext().setAuthentication(authentication);
		}

		filterChain.doFilter(request, response);
	}

	private String extractGuestTokenFromCookies(Cookie[] cookies) {
		if (cookies == null) {
			return null;
		}
		for (Cookie cookie : cookies) {
			if ("guestToken".equals(cookie.getName())) {
				return cookie.getValue();
			}
		}
		return null;
	}
}

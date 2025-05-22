package com.ssafy.sharedress.application.jwt;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtTokenResolver {

	public String resolveAccessToken(HttpServletRequest request) {
		String bearer = request.getHeader("Authorization");
		if (bearer != null && bearer.startsWith("Bearer ")) {
			return bearer.substring(7);
		}
		return null;
	}

	public String resolveRefreshToken(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null) {
			return null;
		}

		for (Cookie cookie : cookies) {
			if ("refreshToken".equals(cookie.getName())) {
				return cookie.getValue();
			}
		}
		return null;
	}
}

package com.ssafy.sharedress.application.jwt;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	// private final JwtTokenProvider jwtTokenProvider;
	// private final CustomUserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {

		// String token = jwtTokenProvider.resolveToken(request);
		//
		// if (token != null && jwtTokenProvider.validateToken(token)) {
		// 	String username = jwtTokenProvider.getUsernameFromToken(token);
		// 	UserDetails userDetails = userDetailsService.loadUserByUsername(username);
		// 	UsernamePasswordAuthenticationToken authentication =
		// 		new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
		//
		// 	SecurityContextHolder.getContext().setAuthentication(authentication);
		// }

		filterChain.doFilter(request, response);
	}
}

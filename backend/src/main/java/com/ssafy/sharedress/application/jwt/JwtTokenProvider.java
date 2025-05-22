package com.ssafy.sharedress.application.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

	@Value("${jwt.secret}")
	private String secretKey;

	private final long accessTokenValidity = 1000L * 60 * 15; // 15분
	private final long refreshTokenValidity = 1000L * 60 * 60 * 24 * 7; // 7일

	// AccessToken 생성
	public String createAccessToken(Long memberId) {
		return createToken(memberId, accessTokenValidity);
	}

	// RefreshToken 생성
	public String createRefreshToken(Long memberId) {
		return createToken(memberId, refreshTokenValidity);
	}

	private String createToken(Long memberId, long validity) {
		Date now = new Date();
		return Jwts.builder()
			.setSubject(String.valueOf(memberId))
			.setIssuedAt(now)
			.setExpiration(new Date(now.getTime() + validity))
			.signWith(SignatureAlgorithm.HS256, secretKey)
			.compact();
	}

	public boolean validateToken(String token) {
		try {
			getClaims(token); // 예외 발생 시 catch
			return true;
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}

	public String getMemberId(String token) {
		return getClaims(token).getSubject();
	}

	private Claims getClaims(String token) {
		return Jwts.parserBuilder()
			.setSigningKey(secretKey)
			.build()
			.parseClaimsJws(token)
			.getBody();
	}
}

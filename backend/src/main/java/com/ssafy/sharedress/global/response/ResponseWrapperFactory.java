package com.ssafy.sharedress.global.response;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;

public class ResponseWrapperFactory<T> {

	private static final ObjectMapper objectMapper = new ObjectMapper();  // 공통 사용

	private final ResponseCode responseCode;
	private final HttpHeaders httpHeaders;
	private final ResponseWrapper<T> responseWrapper;

	private ResponseWrapperFactory(
		ResponseCode responseCode,
		HttpHeaders httpHeaders,
		T content
	) {
		this.responseCode = responseCode;
		this.httpHeaders = mergeDefaultHeaders(httpHeaders);
		this.responseWrapper = new ResponseWrapper<>(responseCode, content);
	}

	// 항상 넣을 기본 헤더 세팅
	private HttpHeaders mergeDefaultHeaders(HttpHeaders headers) {
		if (headers == null) {
			headers = new HttpHeaders();
		}

		headers.addIfAbsent("Content-Type", "application/json; charset=utf-8");
		headers.addIfAbsent("Accept", "application/json");
		headers.addIfAbsent("Link", "<APIDOG Shared docs Link>; rel=\"profile\"");

		return headers;
	}

	// ResponseEntity 생성
	private ResponseEntity<ResponseWrapper<T>> createResponseEntity() {
		return new ResponseEntity<>(this.responseWrapper, this.httpHeaders, this.responseCode.getHttpStatus());
	}

	// HttpServletResponse로 직접 세팅
	private void writeToHttpServletResponse(HttpServletResponse servletResponse) throws IOException {
		// 1. Status
		servletResponse.setStatus(this.responseCode.getHttpStatus().value());

		// 2. Headers
		for (var entry : this.httpHeaders.entrySet()) {
			for (String value : entry.getValue()) {
				servletResponse.addHeader(entry.getKey(), value);
			}
		}

		// 3. Body
		servletResponse.setCharacterEncoding("UTF-8");
		try (PrintWriter writer = servletResponse.getWriter()) {
			writer.write(objectMapper.writeValueAsString(this.responseWrapper));
			writer.flush();
		}
	}

	// ======= Static API for user =======

	// 1. ResponseEntity 반환
	public static <E> ResponseEntity<ResponseWrapper<E>> toResponseEntity(
		ResponseCode responseCode,
		HttpHeaders httpHeaders,
		E content
	) {
		return new ResponseWrapperFactory<>(responseCode, httpHeaders, content).createResponseEntity();
	}

	public static <E> ResponseEntity<ResponseWrapper<E>> toResponseEntity(
		HttpStatus httpStatus,
		HttpHeaders httpHeaders,
		E content
	) {
		return new ResponseWrapperFactory<>(
			DefaultResponseCode.of(httpStatus),
			httpHeaders,
			content
		).createResponseEntity();
	}

	public static <E> ResponseEntity<ResponseWrapper<E>> toResponseEntity(
		ResponseCode responseCode,
		E content
	) {
		return new ResponseWrapperFactory<>(responseCode, null, content).createResponseEntity();
	}

	public static <E> ResponseEntity<ResponseWrapper<E>> toResponseEntity(
		HttpStatus httpStatus,
		E content
	) {
		return new ResponseWrapperFactory<>(
			DefaultResponseCode.of(httpStatus),
			null,
			content
		).createResponseEntity();
	}

	// 2. HttpServletResponse에 직접 세팅 (void)
	public static <E> void toHttpServletResponse(
		HttpServletResponse servletResponse,
		ResponseCode responseCode,
		HttpHeaders httpHeaders,
		E content
	) throws IOException {
		new ResponseWrapperFactory<>(responseCode, httpHeaders, content)
			.writeToHttpServletResponse(servletResponse);
	}

	public static <E> void toHttpServletResponse(
		HttpServletResponse servletResponse,
		HttpStatus httpStatus,
		HttpHeaders httpHeaders,
		E content
	) throws IOException {
		new ResponseWrapperFactory<>(DefaultResponseCode.of(httpStatus), httpHeaders, content)
			.writeToHttpServletResponse(servletResponse);
	}
}

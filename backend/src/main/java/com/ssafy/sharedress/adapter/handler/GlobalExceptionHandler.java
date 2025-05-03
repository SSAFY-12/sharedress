package com.ssafy.sharedress.adapter.handler;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.sharedress.global.exception.BaseException;
import com.ssafy.sharedress.global.response.ResponseCode;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import jakarta.persistence.EntityNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	// Runtime 에 발생하는 예외를 처리하는 핸들러
	@ExceptionHandler(BaseException.class)
	public ResponseEntity<ResponseWrapper<Void>> handleBaseException(BaseException ex) {
		ResponseCode code = ex.getResponseCode();
		return ResponseWrapperFactory.toResponseEntity(code, null);
	}

	// Validation 에서 발생하는 예외를 처리하는 핸들러
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ResponseWrapper<Void>> handleValidationException(MethodArgumentNotValidException ex) {
		String message = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
		return ResponseWrapperFactory.toResponseEntity(new ResponseCode() {
			@Override
			public String getCode() {
				return "400";
			}

			@Override
			public String getMessage() {
				return message;
			}

			@Override
			public HttpStatus getHttpStatus() {
				return HttpStatus.BAD_REQUEST;
			}
		}, null);
	}

	// EntityNotFoundException 에서 발생하는 예외를 처리하는 핸들러
	@ExceptionHandler({EntityNotFoundException.class, DataAccessException.class})
	public ResponseEntity<ResponseWrapper<Void>> handleEntityNotFoundException(Exception ex) {
		return ResponseWrapperFactory.toResponseEntity(new ResponseCode() {
			@Override
			public String getCode() {
				return "400";
			}

			@Override
			public String getMessage() {
				return "DB에 존재하지 않는 데이터를 요청했습니다.";
			}

			@Override
			public HttpStatus getHttpStatus() {
				return HttpStatus.BAD_REQUEST;
			}
		}, null);
	}

	// 그 외 모든 예외를 처리하는 핸들러
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ResponseWrapper<Void>> handleException(Exception ex) {
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, null);
	}
}

package com.ssafy.sharedress.global.exception;

import java.util.function.Supplier;

import com.ssafy.sharedress.global.response.ResponseCode;

public class ExceptionUtil {
	public static void throwException(ResponseCode code) {
		throw new BaseException(code);
	}

	public static Supplier<BaseException> exceptionSupplier(ResponseCode code) {
		return () -> new BaseException(code);
	}
}

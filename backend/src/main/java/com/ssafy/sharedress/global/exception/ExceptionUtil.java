package com.ssafy.sharedress.global.exception;

import com.ssafy.sharedress.global.response.ResponseCode;

public class ExceptionUtil {
	public static void throwException(ResponseCode code) {
		throw new BaseException(code);
	}
}

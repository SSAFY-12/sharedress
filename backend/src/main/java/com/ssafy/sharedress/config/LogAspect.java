package com.ssafy.sharedress.config;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Aspect
@Slf4j
@Component
public class LogAspect {

	private static final ThreadLocal<Map<String, Object>> requestInfoHolder = new ThreadLocal<>();

	@Pointcut("execution(* com.ssafy.sharedress.adapter..*Controller.*(..))")
	public void controller() {
	}

	@Pointcut("execution(* com.ssafy.sharedress.application..*UseCase.*(..))")
	public void service() {
	}

	@Pointcut("execution(* com.ssafy.sharedress.domain..*Repository.*(..))")
	public void repository() {
	}

	@Around("controller()")
	public Object logController(ProceedingJoinPoint joinPoint) throws Throwable {
		Map<String, Object> params = new HashMap<>();

		// ✨ Controller에서만 Request 정보를 추출하여 ThreadLocal에 저장
		HttpServletRequest request = ((ServletRequestAttributes)Objects.requireNonNull(
			RequestContextHolder.getRequestAttributes())).getRequest();
		String decodedUri = URLDecoder.decode(request.getRequestURI(), StandardCharsets.UTF_8);

		params.put("request_uri", decodedUri);
		params.put("http_method", request.getMethod());
		params.put("params", getParams(request));

		// ThreadLocal에 정보 저장
		requestInfoHolder.set(params);

		// ✨ 실행 시간 측정 시작
		long startTime = System.currentTimeMillis();

		// ✨ 로그 출력
		loggingExecution(joinPoint.getSignature().getDeclaringTypeName(), joinPoint.getSignature().getName());
		// ✨ 메서드 실행
		log.debug("[{}] {}", params.get("http_method"), params.get("request_uri"));
		log.debug("params: {}", params.get("params"));

		Object result = null;
		try {
			result = joinPoint.proceed();
		} finally {
			// ✨ 실행 시간 측정 종료
			long endTime = System.currentTimeMillis();
			long elapsedTime = endTime - startTime;

			// ✨ ThreadLocal 메모리 해제
			requestInfoHolder.remove();

			loggingCompleted(
				joinPoint.getSignature().getDeclaringTypeName(),
				joinPoint.getSignature().getName(),
				elapsedTime
			);
		}

		return result;
	}

	@Around("service() || repository()")
	public Object logServiceAndRepository(ProceedingJoinPoint joinPoint) throws Throwable {
		// Service와 Repository는 RequestContextHolder가 없으므로 ThreadLocal에 저장된 정보만 사용
		String className = joinPoint.getSignature().getDeclaringTypeName();
		String methodName = joinPoint.getSignature().getName();

		// ✨ 실행 시간 측정 시작
		long startTime = System.currentTimeMillis();
		loggingExecution(className, methodName);

		Object result = joinPoint.proceed();

		// ✨ 실행 시간 측정 종료
		long endTime = System.currentTimeMillis();
		long elapsedTime = endTime - startTime;

		loggingCompleted(className, methodName, elapsedTime);

		return result;
	}

	private static JSONObject getParams(HttpServletRequest request) {
		JSONObject jsonObject = new JSONObject();
		Enumeration<String> params = request.getParameterNames();
		while (params.hasMoreElements()) {
			String param = params.nextElement();
			String replaceParam = param.replaceAll("\\.", "-");
			jsonObject.put(replaceParam, request.getParameter(param));
		}
		return jsonObject;
	}

	private static void loggingExecution(String className, String methodName) {
		log.debug("▶ Executing: {}.{}", className, methodName);
	}

	private static void loggingCompleted(String className, String methodName, long elapsedTime) {
		log.debug("✔ Completed: {}.{} ({} ms)", className, methodName, elapsedTime);
	}
}

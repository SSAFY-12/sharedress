package com.ssafy.sharedress.application.guest.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.ssafy.sharedress.application.guest.annotation.CurrentGuest;
import com.ssafy.sharedress.application.guest.dto.CustomGuestDetails;
import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.guest.error.GuestErrorCode;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

@Component
public class CurrentGuestArgumentResolver implements HandlerMethodArgumentResolver {

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.getParameterAnnotation(CurrentGuest.class) != null
			&& parameter.getParameterType().equals(Guest.class);
	}

	@Override
	public Object resolveArgument(
		MethodParameter parameter,
		ModelAndViewContainer mavContainer,
		NativeWebRequest webRequest,
		WebDataBinderFactory binderFactory
	) throws Exception {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		if (auth != null && auth.getPrincipal() instanceof CustomGuestDetails details) {
			return details.guest();
		}

		ExceptionUtil.throwException(GuestErrorCode.GUEST_UNAUTHORIZED);
		return null;
	}
}

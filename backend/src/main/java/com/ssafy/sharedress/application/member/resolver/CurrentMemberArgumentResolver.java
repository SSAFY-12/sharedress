package com.ssafy.sharedress.application.member.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.ssafy.sharedress.application.member.annotation.CurrentMember;
import com.ssafy.sharedress.application.member.dto.CustomMemberDetails;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.error.MemberErrorCode;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

@Component
public class CurrentMemberArgumentResolver implements HandlerMethodArgumentResolver {

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.getParameterAnnotation(CurrentMember.class) != null
			&& parameter.getParameterType().equals(Member.class);
	}

	@Override
	public Object resolveArgument(
		MethodParameter parameter,
		ModelAndViewContainer mavContainer,
		NativeWebRequest webRequest,
		WebDataBinderFactory binderFactory
	) throws Exception {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		if (auth != null && auth.getPrincipal() instanceof CustomMemberDetails details) {
			return details.member();
		}

		ExceptionUtil.throwException(MemberErrorCode.MEMBER_UNAUTHORIZED);
		return null;
	}
}

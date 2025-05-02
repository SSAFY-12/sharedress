package com.ssafy.sharedress.adapter.member.in;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.auth.dto.CustomMemberDetails;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberController {

	@GetMapping("/me")
	public ResponseEntity<ResponseWrapper<Member>> getMe(@AuthenticationPrincipal CustomMemberDetails memberDetails) {
		Member member = memberDetails.member();
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, member);
	}
}
